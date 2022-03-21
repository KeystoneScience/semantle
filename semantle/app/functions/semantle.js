import fetch from "node-fetch";

const BASE_URL = "https://semantle.novalis.org/model2";

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

async function getSimilarityStory(secret) {
  const url = BASE_URL + "/similarity/" + secret;
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function getModel(word, secret) {
  //   if (cache.hasOwnProperty(word)) {
  //     return cache[word];
  //   }
  const url = "/model2/" + secret + "/" + word.replace(/\ /gi, "_");
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

//returns the 10 nearest words.
async function getNearby(word) {
  const url = "/nearby/" + word;
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
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

  async function submit(guess) {
    if (secretVec === null) {
      secretVec = (await getModel(secret)).vec;
    }
    if (!guess) {
      return false;
    }
    guess = guess.toLowerCase();

    if (typeof unbritish !== "undefined" && unbritish.hasOwnProperty(guess)) {
      guess = unbritish[guess];
    }

    const guessData = await getModel(guess);
    if (!guessData) {
      //word not found
      return false;
    }

    let percentile = guessData.percentile;

    const guessVec = guessData.vec;

    // cache[guess] = guessData;

    let similarity = getCosSim(guessVec, secretVec) * 100.0;
    if (!guessed.has(guess)) {
      if (!gameOver) {
        guessCount += 1;
      }
      guessed.add(guess);

      const newEntry = [similarity, guess, percentile, guessCount];
      guesses.push(newEntry);

      if (handleStats) {
        const stats = getStats();
        if (!gameOver) {
          stats["totalGuesses"] += 1;
        }
        storage.setItem("stats", JSON.stringify(stats));
      }
    }
    guesses.sort(function (a, b) {
      return b[0] - a[0];
    });

    if (!gameOver) {
      saveGame(-1, -1);
    }

    chrono_forward = 1;

    latestGuess = guess;
    updateGuesses();

    firstGuess = false;
    if (guess.toLowerCase() === secret && !gameOver) {
      endGame(true, true);
    }
    return false;
  }

  const winState = storage.getItem("winState");
  if (winState != null) {
    guesses = JSON.parse(storage.getItem("guesses"));
    for (let guess of guesses) {
      guessed.add(guess[1]);
    }
    guessCount = guessed.size;
    latestGuess = "";
    updateGuesses();
    if (winState != -1) {
      endGame(winState > 0, false);
    }
  }
}

//reutrns an array of guesses sorted by similarity
function updateGuesses() {
  let inner = `<tr><th id="chronoOrder">#</th><th id="alphaOrder">Guess</th><th id="similarityOrder">Similarity</th><th>Getting close?</th></tr>`;
  /* This is dumb: first we find the most-recent word, and put
           it at the top.  Then we do the rest. */
  for (let entry of guesses) {
    let [similarity, oldGuess, percentile, guessNumber] = entry;
    if (oldGuess == latestGuess) {
      inner += guessRow(
        similarity,
        oldGuess,
        percentile,
        guessNumber,
        latestGuess
      );
    }
  }
  inner += "<tr><td colspan=4><hr></td></tr>";
  for (let entry of guesses) {
    let [similarity, oldGuess, percentile, guessNumber] = entry;
    if (oldGuess != latestGuess) {
      inner += guessRow(similarity, oldGuess, percentile, guessNumber);
    }
  }
  guesses.sort(function (a, b) {
    return b[0] - a[0];
  });
  return guesses;
  // $("#guesses").innerHTML = inner;
  // $("#chronoOrder").addEventListener("click", (event) => {
  //   guesses.sort(function (a, b) {
  //     return chrono_forward * (a[3] - b[3]);
  //   });
  //   chrono_forward *= -1;
  //   updateGuesses();
  // });
  // $("#alphaOrder").addEventListener("click", (event) => {
  //   guesses.sort(function (a, b) {
  //     return a[1].localeCompare(b[1]);
  //   });
  //   chrono_forward = 1;
  //   updateGuesses();
  // });
  // $("#similarityOrder").addEventListener("click", (event) => {
  //   guesses.sort(function (a, b) {
  //     return b[0] - a[0];
  //   });
  //   chrono_forward = 1;
  //   updateGuesses();
  // });
}

export {
  mag,
  dot,
  getCosSim,
  plus,
  minus,
  scale,
  project_along,
  getSimilarityStory,
  getModel,
  getNearby,
  init,
  updateGuesses,
};
