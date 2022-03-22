// import { getNearby, getModel, getSimilarityStory } from "../api/words.js";
import { useState } from "react";
import client from "../api/client";
import secretWords from "../configs/secretWords";

//returns the 10 nearest words.
async function getNearby(word) {
  const url = "nearby/" + word;
  const response = await client.get(url);
  return response?.data;
}

async function getModel(word, secret) {
  const url = "model2/" + secret + "/" + word.replace(/\ /gi, "_");
  const response = await client.get(url);
  return response?.data;
}

async function getSimilarityStory(secret) {
  const url = "similarity/" + secret;
  const response = await client.get(url);
  return response?.data;
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
const guessed = new Set();
export default function semantle() {
  const [guesses, setGuesses] = useState([]);
  const [secret, setSecret] = useState("");
  const [similarityStory, setSimilarityStory] = useState(null);

  async function submit(guess, secret) {
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

    const guessData = await getModel(guess, secret);
    if (!guessData) {
      //word not found
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
      let newGuesses = [...guesses, newEntry];
      newGuesses.sort((a, b) => b.similarity - a.similarity);
      setGuesses(newGuesses);
      // guesses.push(newEntry);

      // if (handleStats) {
      //   const stats = getStats();
      //   if (!gameOver) {
      //     stats["totalGuesses"] += 1;
      //   }
      //   storage.setItem("stats", JSON.stringify(stats));
      // }
    }
    //

    // if (!gameOver) {
    //   saveGame(-1, -1);
    // }

    // chrono_forward = 1;

    // latestGuess = guess;
    // updateGuesses();

    // firstGuess = false;
    // if (guess.toLowerCase() === secret && !gameOver) {
    //   endGame(true, true);
    // }
    return false;
  }

  async function initialize() {
    const similarity = await getSimilarityStory("test");
    setSimilarityStory(similarity);
    // secretVec = (await getModel(secret, secret)).vec;
    // const guesses = await getNearby(secret);
    // setGuesses(guesses);
  }

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
    similarityStory,
    guesses,
  };
}
