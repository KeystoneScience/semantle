// import { getNearby, getModel, getSimilarityStory } from "../api/words.js";
import { useState } from "react";
import client from "../api/client";
import secretWords from "../data/secretWords";
import similarStory from "../data/quickSimilars";
import cache from "../utility/cache";
import { Alert } from "react-native";

const SEMANTLE_START_MILLIS_SINCE_EPOCH = 1643436000000;

//returns the 10 nearest words.
async function getNearby(word) {
  const url = "nearby/" + word;
  const response = await client.get(url);
  return response?.data;
}

async function getModel(word, secret) {
  const url = "model2?secret=" + secret + "&word=" + word.replace(/\ /gi, "_");
  const response = await client.get(url);
  const body = response?.data?.body;
  const json = JSON.parse(body);
  return json;
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
      if (foundWord) {
        //Word Found.
        const data = await cache.getData("SEMANTLE_STREAK", true);
        if (data) {
          cache.storeData("SEMANTLE_STREAK", { streak: data.streak + 1 });
        } else {
          cache.storeData("SEMANTLE_STREAK", { streak: 1 });
        }
      }

      editStats(newEntry, foundWord);
    }

    return false;
  }

  async function getStreak() {
    const data = await cache.getData("SEMANTLE_STREAK", true);
    if (data) {
      return data.streak;
    }
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
    const data = cache.getData("SEMANTLE_ACTIVE_DAYS", true);
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
  }

  function checkEasterEggs(guess) {}

  async function init() {
    secret = secretWords[puzzleNumber].toLowerCase();
    const yesterday = secretWords[yesterdayPuzzleNumber].toLowerCase();

    try {
      const yesterdayNearby = await getNearby(yesterday);
      const secretBase64 = btoa(unescape(encodeURIComponent(yesterday)));
      console.log(
        `${yesterdayNearby.join(
          ", "
        )}, in descending order of closensess. ${secretBase64} More?`
      );
    } catch (e) {
      console.log("Coming soon!");
    }

    try {
      similarityStory = await getSimilarityStory(secret);
      console.log(`
Today is puzzle number <b>${puzzleNumber}</b>. The nearest word has a similarity of
<b>${(similarityStory.top * 100).toFixed(
        2
      )}</b>, the tenth-nearest has a similarity of
${(similarityStory.top10 * 100).toFixed(
  2
)} and the one thousandth nearest word has a
similarity of ${(similarityStory.rest * 100).toFixed(2)}.
`);
    } catch {
      // we can live without this in the event that something is broken
    }

    if (storage.getItem("prefersDarkColorScheme") === null) {
      $("#dark-mode").checked = false;
      $("#dark-mode").indeterminate = true;
    }

    $("#give-up-btn").addEventListener("click", function (event) {
      if (!gameOver) {
        if (confirm("Are you sure you want to give up?")) {
          endGame(false, true);
        }
      }
    });

    const winState = storage.getItem("winState");
    if (winState != null) {
      guesses = JSON.parse(storage.getItem("guesses"));
      for (let guess of guesses) {
        guessed.add(guess[1]);
      }
      latestGuess = "";
      updateGuesses();
      if (winState != -1) {
        endGame(winState > 0, false);
      }
    }
  }

  return {
    project_along,
    init,
    submit,
    initialize,
    getStreak,
    checkEasterEggs,
    getStats,
    lastGuess,
    similarityStory,
    puzzleNumber,
    guesses,
  };
}
