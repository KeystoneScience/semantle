// import { getNearby, getModel, getSimilarityStory } from "../api/words.js";
import { useState, useEffect } from "react";
import client from "../api/client";
import secretWords from "../data/secretWords";
import similarStory from "../data/quickSimilars";
import cache from "../utility/cache";
import { Alert } from "react-native";

const SEMANTLE_START_MILLIS_SINCE_EPOCH = 1643418000000;
const MILLIS_PER_DAY = 86400000;

//returns the 10 nearest words.
async function getNearby(word) {
  const url = "model2/nearby?secret=" + word;
  const response = await client.get(url);
  const body = response?.data?.body;
  const json = JSON.parse(body);
  return json;
}

async function getModel(word, secret) {
  const url = "model2?secret=" + secret + "&word=" + word.replace(/\ /gi, "_");
  const response = await client.get(url);
  const body = response?.data?.body;
  const json = JSON.parse(body);
  return json;
}

async function postPushToken(pushToken, deviceNugget) {
  const dataJson = {
    token: pushToken,
    deviceNugget: deviceNugget,
  };

  return client.post("token", dataJson, {}, false);
}

function getPuzzleNumber() {
  //get millis since epoch
  const millis = Date.now();
  //get millis since SEMANTLE_START_MILLIS_SINCE_EPOCH
  const millisSinceSemantleStart = millis - SEMANTLE_START_MILLIS_SINCE_EPOCH;
  //get day since SEMANTLE_START_MILLIS_SINCE_EPOCH
  const daysSinceSemantleStart = Math.floor(
    millisSinceSemantleStart / 1000 / 60 / 60 / 24
  );
  return daysSinceSemantleStart;
}

function getSimilarityStory(secret) {
  // const url = "similarity/" + secret;
  // const response = await client.get(url);
  return similarStory[secret];
}

function mag(a) {
  return Math.sqrt(
    a.reduce(function (sum, val) {
      return sum + val * val;
    }, 0)
  );
}

function dot(f1, f2) {
  return f1.reduce(function (sum, a, idx) {
    return sum + a * f2[idx];
  }, 0);
}

function getCosSim(f1, f2) {
  return dot(f1, f2) / (mag(f1) * mag(f2));
}

function plus(v1, v2) {
  const out = [];
  for (let i = 0; i < v1.length; i++) {
    out.push(v1[i] + v2[i]);
  }
  return out;
}

function minus(v1, v2) {
  const out = [];
  for (let i = 0; i < v1.length; i++) {
    out.push(v1[i] - v2[i]);
  }
  return out;
}

function scale(v, s) {
  const out = [];
  for (let i = 0; i < v.length; i++) {
    out.push(v[i] * s);
  }
  return out;
}

function project_along(v1, v2, t) {
  const v = minus(v2, v1);
  const num = dot(minus(t, v1), v);
  const denom = dot(v, v);
  return num / denom;
}
var secretVec = null;
var guessed = new Set();
export default function semantle() {
  const [guesses, setGuesses] = useState([]);
  const [secret, setSecret] = useState("");
  const [similarityStory, setSimilarityStory] = useState(null);
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [lastGuess, setLastGuess] = useState(null);
  const [timeUntilNextPuzzle, setTimeUntilNextPuzzle] = useState(10000000000);
  const [streak, setStreak] = useState(0);
  const [yesterdayClosest, setYesterdayClosest] = useState([]);

  async function submit(guess) {
    if (guess.toLowerCase() === "hardreset") {
      hardReset();
      return;
    }
    if (secretVec === null) {
      secretVec = (await getModel(secret, secret)).vec;
    }
    if (!guess) {
      return false;
    }
    guess = guess.toLowerCase();

    if (typeof unbritish !== "undefined" && unbritish.hasOwnProperty(guess)) {
      guess = unbritish[guess];
    }

    if (guessed.has(guess)) {
      //find the index of the guess in guesses
      const index = guesses.findIndex((g) => g.guess === guess);
      setLastGuess({ ...guesses[index], lastGuess: true });
      return false;
    }

    const guessData = await getModel(guess, secret);
    if (!guessData) {
      //word not found
      setLastGuess({
        guess: `'${guess}' not found in our dictionary.`,
        lastGuess: true,
        notFound: true,
      });
      return false;
    }
    //may be null if word not in top 1000;
    let percentile = guessData.percentile;

    const guessVec = guessData.vec;

    // cache[guess] = guessData;

    let similarity = getCosSim(guessVec, secretVec) * 100.0;
    if (!guessed.has(guess)) {
      guessed.add(guess);

      const newEntry = {
        similarity,
        guess,
        percentile,
        guessCount: guesses.length,
      };
      setLastGuess({ ...newEntry, lastGuess: true });
      let newGuesses = [...guesses, newEntry];
      newGuesses.sort((a, b) => b.similarity - a.similarity);
      cache.storeData("SEMANTLE_" + puzzleNumber, newGuesses);
      setGuesses(newGuesses);
      const foundWord = guess.toLowerCase() === secret.toLowerCase();
      editStats(newEntry, foundWord);
      if (foundWord) {
        //Word Found.
        const data = await cache.getData("SEMANTLE_STREAK", true);
        if (data) {
          cache.storeData("SEMANTLE_STREAK", { streak: data.streak + 1 });
          setStreak(data.streak + 1);
        } else {
          cache.storeData("SEMANTLE_STREAK", { streak: 1 });
          setStreak(1);
        }
        return true;
      }
    }

    return false;
  }

  async function getStreak() {
    const data = await cache.getData("SEMANTLE_STREAK", true);
    if (data) {
      setStreak(data.streak);
      return data.streak;
    }
    setStreak(0);
    return 0;
  }

  function hardReset() {
    //prompt user to confirm
    Alert.alert("Reset all data?", "this will reset all your in-app data.", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          cache.clearAsyncStorage();
          initialize();
        },
      },
    ]);
  }

  async function getStats() {
    const data = await cache.getData("SEMANTLE_STATS", true);
    if (data) {
      return data.daysMap;
    }
    return {};
  }

  async function editStats(newestGuess, isFound = false) {
    const data = await cache.getData("SEMANTLE_STATS", false);
    var daysMap = data?.daysMap ? data.daysMap : {};
    const existingData = daysMap["STATS_DAY_" + puzzleNumber] || {};
    if (existingData.found) {
      return;
    }
    //assemble data
    existingData.found = isFound;
    existingData.day = puzzleNumber;
    existingData.numberOfGuesses = existingData.numberOfGuesses
      ? existingData.numberOfGuesses + 1
      : 1;
    existingData.averageSimilarity =
      ((existingData.averageSimilarity || 0) *
        (existingData.numberOfGuesses - 1)) /
        existingData.numberOfGuesses +
      newestGuess.similarity / existingData.numberOfGuesses;

    daysMap["STATS_DAY_" + puzzleNumber] = existingData;
    cache.storeData("SEMANTLE_STATS", { daysMap: daysMap });
  }

  async function getAndSetYesterdayClosest(day = puzzleNumber) {
    const yesterdaysWord = getYesterdaysWord(day);
    const yesterdayData = await getNearby(yesterdaysWord);
    setYesterdayClosest(yesterdayData);
  }

  async function initialize() {
    // check to see if there is information cached.
    guessed = new Set();
    setLastGuess(null);
    const day = getPuzzleNumber();
    setPuzzleNumber(day);
    const secretWord = secretWords[day % secretWords.length];
    setSecret(secretWord);
    const similarity = getSimilarityStory(secretWord);
    setSimilarityStory(similarity);
    const guessData = await cache.getData("SEMANTLE_" + day, false);
    if (guessData) {
      setGuesses(guessData);
      //for each guess in guessData, add it to guessed
      for (let i = 0; i < guessData.length; i++) {
        guessed.add(guessData[i].guess);
      }
    } else {
      setGuesses([]);
    }
    countdown(day);
    getAndSetYesterdayClosest(day);
    getStreak();

    //set a timer that checks to see if the time until the next puzzle is up.
    //if it is, then reset the puzzle.
  }

  function formatTime(time) {
    //convert time in millis to hours, minutes, seconds
    var hours = Math.floor(time / 3600000);
    var minutes = Math.floor((time % 3600000) / 60000);
    var seconds = Math.floor((time % 60000) / 1000);
    return `${hours}h ${minutes}m`;
  }

  async function countdown(day = puzzleNumber) {
    const time = getTimeUntilNextPuzzle(day);
    setTimeUntilNextPuzzle(time);
    if (time > 0) {
      setTimeout(() => {
        countdown(day);
      }, 20000);
    } else {
      if (time < -1000000) return;
      initialize();
    }
  }

  function getTimeUntilNextPuzzle(day = puzzleNumber) {
    const timestampOfNextPuzzle =
      SEMANTLE_START_MILLIS_SINCE_EPOCH + (day + 1) * MILLIS_PER_DAY;
    return timestampOfNextPuzzle - Date.now();
  }

  function getYesterdaysWord(dayNumber = puzzleNumber) {
    const day = dayNumber - 1;
    const secretWord = secretWords[day % secretWords.length];
    return secretWord;
  }

  function checkEasterEggs(guess) {}

  return {
    project_along,
    submit,
    getTimeUntilNextPuzzle,
    initialize,
    getStreak,
    checkEasterEggs,
    getStats,
    formatTime,
    getYesterdaysWord,
    postPushToken,
    lastGuess,
    yesterdayClosest,
    streak,
    timeUntilNextPuzzle,
    similarityStory,
    puzzleNumber,
    guesses,
  };
}
