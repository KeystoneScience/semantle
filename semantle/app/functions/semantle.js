// import { getNearby, getModel, getSimilarityStory } from "../api/words.js";
import { useState, useEffect } from "react";
import client from "../api/client";
import secretWords from "../data/secretWords";
import similarStory from "../data/quickSimilars";
import cache from "../utility/cache";
import { Alert } from "react-native";

const SEMANTLE_START_MILLIS_SINCE_EPOCH = 1643414400000;
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

async function postPushToken(pushToken, deviceNugget, userID) {
  const dataJson = {
    token: userID,
    deviceNugget: deviceNugget,
    pushToken: pushToken,
  };

  return client.post("token", dataJson, {}, false);
}

async function postStreak(streak, puzzleNumber) {
  const previousToken = await cache.getData("SEMANTLE::PUSH_TOKEN", false);
  if (!previousToken) {
    return;
  }
  let userObj = await cache.getData("SEMANTLE::USER", false);
  let userID = userObj?.userID;
  //if there is no userID, create one and store it in the cache
  if (!userObj || !userObj.userID) {
    userID =
      "user" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    cache.storeData("SEMANTLE::USER", { userID });
  }

  const dataJson = {
    userID: userID,
    puzzleNumber: puzzleNumber,
    streak: streak,
    pushToken: previousToken,
  };

  return client.post("streak", dataJson, {}, false);
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
  const [streakCacheData, setStreakCacheData] = useState(null);

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
        const data = await cache.getData("SEMANTLE_STREAK", false);
        setStreakCacheData(data);
        if (data && (!data.day || data.day == puzzleNumber - 1)) {
          cache.storeData("SEMANTLE_STREAK", {
            streak: data.streak + 1,
            day: puzzleNumber,
          });
          postStreak(data.streak + 1, puzzleNumber);
          setStreak(data.streak + 1);
        } else {
          cache.storeData("SEMANTLE_STREAK", { streak: 1, day: puzzleNumber });
          postStreak(1, puzzleNumber);
          setStreak(1);
        }
        return true;
      }
    }

    return false;
  }

  // Sorts by the different metrics
  // possible metrics: similarity, guessCount, percentile, guess
  function sortGuesses(metric) {
    let newGuesses = [...guesses];
    newGuesses.sort((a, b) => b[metric] - a[metric]);
    setGuesses(newGuesses);
  }

  async function getStreak(puzzleNumber = this.puzzleNumber) {
    const data = await cache.getData("SEMANTLE_STREAK", false);
    setStreakCacheData(data);
    if (
      data &&
      (!data.day || data.day == puzzleNumber - 1 || data.day == puzzleNumber)
    ) {
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
    const data = await cache.getData("SEMANTLE_STATS", false);
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

  function getWinShareString() {
    //get guesses whose guessNumber is 0
    if (guesses.length == 0) {
      return "I haven't found any words yet!";
    }
    if (guesses.length == 1) {
      return `I solved Semantle #${puzzleNumber} in only one guess!`;
    }
    function similarityString(guess) {
      return `${guess.similarity.toFixed(2)}%${
        guess.percentile ? ` (${guess.percentile}/1000)` : ""
      }`;
    }
    let temporallySorted = [...guesses];
    temporallySorted.sort((a, b) => a["guessCount"] - b["guessCount"]);
    //get the first guess who has a non-null percentile
    let firstGuess = temporallySorted[0];
    let firstIn1000 = temporallySorted.find((g) => g.percentile !== null);
    const secondToLast = temporallySorted[temporallySorted.length - 2];
    let shareString = `I solved Semantle #${puzzleNumber} in ${
      guesses.length
    } guesses. My first guess had a similarity of ${similarityString(
      firstGuess
    )}.`;
    if (firstIn1000.guessCount != 0) {
      shareString += ` My first guess in the top 1000 was at guess #${
        firstIn1000.guessCount + 1
      }.`;
    }
    shareString += ` My penultimate guess had a similarity of ${similarityString(
      secondToLast
    )}.`;
    return shareString;
  }

  async function getAndSetYesterdayClosest(day = puzzleNumber) {
    const yesterdaysWord = getYesterdaysWord(day);
    const yesterdayData = await getNearby(yesterdaysWord);
    setYesterdayClosest(yesterdayData);
  }

  async function initialize() {
    // check to see if there is information cached.
    guessed = new Set();
    secretVec = null;
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
    getStreak(day);

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
    const calculatedTimeUntilNextPuzzle = timestampOfNextPuzzle - Date.now();
    if (calculatedTimeUntilNextPuzzle < 0) {
      initialize();
    }
    return calculatedTimeUntilNextPuzzle;
  }

  function generateDiagnostics() {
    let diagnosticsString = "";
    diagnosticsString += `Secret word: ${"REDACTED"}\n`;
    diagnosticsString += `time until next puzzle: ${formatTime(
      timeUntilNextPuzzle
    )}\n`;
    diagnosticsString += `guesses: ${guesses.length}\n`;
    diagnosticsString += `guessed: ${guessed.size}\n`;
    diagnosticsString += `yesterday closest: ${yesterdayClosest}\n`;
    diagnosticsString += `streak: ${streak}\n`;
    diagnosticsString += `puzzle number: ${puzzleNumber}\n`;
    diagnosticsString += `similarity story: ${JSON.stringify(
      similarityStory
    )}\n`;
    // diagnosticsString += `secret vec: ${JSON.stringify(secretVec)}\n`;
    diagnosticsString += `streak cache data: ${JSON.stringify(
      streakCacheData
    )}\n`;

    return diagnosticsString;
  }

  function getYesterdaysWord(dayNumber = puzzleNumber) {
    const day = dayNumber - 1;
    const secretWord = secretWords[day % secretWords.length];
    return secretWord;
  }

  function checkEasterEggs(guess = "") {
    guess = guess.toLowerCase();
    if (guess === "semantlepro") {
      return {
        place: "HOME",
        change: "THEME",
        text: "original",
      };
    } else if (guess === "semantlebase") {
      return {
        place: "HOME",
        change: "THEME",
        text: "",
      };
    } else if (guess === "rundiagnostics") {
      return {
        place: "HOME",
        change: "DIAGNOSTICS",
      };
    } else if (guess === "alertall") {
      Alert.alert("Huh?", "Why would you type that...");
    } else if (guess.includes("podbay")) {
      Alert.alert("I'm sorry dave.", "I'm afraid I can't do that.");
    } else if (guess === "stevejobs" || guess === "apple") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Steve Jobs",
        logo: "apple",
      };
    } else if (guess === "billgates" || guess === "microsoft") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Bill Gates",
        logo: "microsoft",
      };
    } else if (guess === "ethyl") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Puppy",
        logo: "dog",
      };
    } else if (guess === "markzuckerberg" || guess === "facebook") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Mark Zuckerberg",
        logo: "facebook",
      };
    } else if (guess === "elonmusk" || guess === "tesla") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Elon Musk",
        logo: "tesla",
      };
    } else if (guess === "peterthiel" || guess === "paypal") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Tim Cook",
        logo: "paypal",
      };
    } else if (guess === "reddit") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Tim Cook",
        logo: "reddit",
      };
    } else if (guess === "semantle") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Apple Inc.",
        logo: "wink",
      };
    } else if (guess === "google") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "Google LLC",
        logo: "google",
      };
    } else if (guess === "party") {
      return {
        place: "HOME",
        action: "confetti",
      };
    } else if (guess === "ascii" || guess === "binary" || guess === "hex") {
      return {
        place: "HEADER",
        change: "TITLE",
        text: "#8369776578847669",
      };
    } else if (guess === "testwin") {
      return {
        place: "HOME",
        action: "win",
      };
    }
  }

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
    sortGuesses,
    getWinShareString,
    generateDiagnostics,
    lastGuess,
    yesterdayClosest,
    streak,
    timeUntilNextPuzzle,
    similarityStory,
    puzzleNumber,
    guesses,
  };
}
