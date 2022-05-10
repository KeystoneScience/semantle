// import { getNearby, getModel, getSimilarityStory } from "../api/words.js";
import { useState, useEffect } from "react";
import client from "../api/client";
import cache from "../utility/cache";
import { Alert, Clipboard } from "react-native";
import i18n from "i18n-js";
import { logger, transportFunctionType } from "react-native-logs";
import translate from "../configs/translate";
const SEMANTLE_START_MILLIS_SINCE_EPOCH = 1643414400000;
const MILLIS_PER_DAY = 86400000;
const VERSION_CODE = "1.0.7";

var SECRET_WORDS = [];

var USER_ID = null;

const customTransport = (props) => {
  // handleTransport(props);
  console.log(props.msg);
};

async function handleTransport(props) {
  if (!USER_ID) {
    let userObj = await cache.getData("SEMANTLE::USER", false);
    USER_ID = userObj?.userID;
  }

  props.msg += " |USER: " + USER_ID;
  return await client.post("log", props, {}, false);
}

const config = {
  transport: customTransport,
};

var log = logger.createLogger(config);
//returns the 10 nearest words.
async function getNearby(rawWord) {
  const word = encodeURIComponent(rawWord);
  const url = "model2/nearby?secret=" + word + "&language=" + i18n.locale;
  const response = await client.get(url);
  const body = response?.data?.body;
  const json = JSON.parse(body);
  return json;
}

async function fetchSecretWords(day, language = "en") {
  //wordset:
  // {
  //   "secretWords": [...],
  //   "timestamp": millisSinceEpoch
  //}
  const wordSet = await cache.getData(
    `SEMANTLE::SECRET_WORDS::${language}`,
    false
  );
  //if wordset exists and is not older than 10 days, return it
  if (wordSet && wordSet.timestamp > Date.now() - MILLIS_PER_DAY * 10) {
    SECRET_WORDS = wordSet.secretWords;
    return wordSet.secretWords[day % wordSet.secretWords.length];
  }

  const url = `https://semantle.s3.us-east-2.amazonaws.com/secrets/${language}.json`;
  const response = await client.get(url);
  const body = response?.data;
  // store the wordset in the cache
  cache.storeData(`SEMANTLE::SECRET_WORDS::${language}`, {
    secretWords: body,
    timestamp: Date.now(),
  });
  SECRET_WORDS = body;
  return body[day % body.length];
}

async function fetchSimilarityStory(rawSecret, day, language = "en") {
  //simStory:
  // {
  //   "top": .89238749223423,
  //   "top10": .5816293698798723,
  //   "rest": .3081197440624237
  //}
  const secret = encodeURIComponent(rawSecret);
  const simStory = await cache.getData(
    `SEMANTLE::SIMILARITY_STORY::${secret}::${language}::${day}`,
    false
  );
  if (simStory) {
    return simStory;
  }

  const url = "model2/percentile?secret=" + secret + "&language=" + language;
  const response = await client.get(url);
  const body = response?.data?.body;
  const json = await JSON.parse(body);
  cache.storeData(
    `SEMANTLE::SIMILARITY_STORY::${secret}::${language}::${day}`,
    json
  );
  return json;
}

async function getModel(word, secret) {
  //encode word as UTF-8 and secret as UTF-8
  const wordUTF8 = encodeURIComponent(word.replace(/\ /gi, "_"));
  const secretUTF8 = encodeURIComponent(secret);

  const url =
    "model2?secret=" +
    secretUTF8 +
    "&word=" +
    wordUTF8 +
    "&language=" +
    i18n.locale;

  console.log("URL", url);
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
    language: i18n.locale,
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
  const [similarityStory, setSimilarityStory] = useState({
    top: 0,
    top10: 0,
    rest: 0,
  });
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [lastGuess, setLastGuess] = useState(null);
  const [timeUntilNextPuzzle, setTimeUntilNextPuzzle] = useState(10000000000);
  const [streak, setStreak] = useState(0);
  const [yesterdayClosest, setYesterdayClosest] = useState([]);
  const [streakCacheData, setStreakCacheData] = useState(null);

  async function submit(guess, test = false) {
    if (guess.toLowerCase() === "hardreset") {
      hardReset();
      return;
    }
    if (guess.toLowerCase() === "showmethesecret") {
      Alert.alert("Secret", secret);
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
        guess: `'${guess}' ${i18n.t("not found in our dictionary")}`,
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
    return await handleSubmit({ guess, similarity, percentile });
  }

  async function handleSubmit({ guess, similarity, percentile }) {
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
      cache.storeData(
        "SEMANTLE_" + puzzleNumber + (i18n.locale === "en" ? "" : i18n.locale),
        newGuesses
      );
      setGuesses(newGuesses);
      const foundWord = guess.toLowerCase() === secret.toLowerCase();
      editStats(newEntry, foundWord);
      if (foundWord) {
        //Word Found.
        const data = await cache.getData(
          "SEMANTLE_STREAK" + (i18n.locale === "en" ? "" : i18n.locale),
          false
        );
        setStreakCacheData(data);
        if (data && (!data.day || data.day == puzzleNumber - 1)) {
          cache.storeData(
            "SEMANTLE_STREAK" + (i18n.locale === "en" ? "" : i18n.locale),
            {
              streak: data.streak + 1,
              day: puzzleNumber,
            }
          );
          postStreak(data.streak + 1, puzzleNumber);
          setStreak(data.streak + 1);
        } else {
          cache.storeData(
            "SEMANTLE_STREAK" + (i18n.locale === "en" ? "" : i18n.locale),
            { streak: 1, day: puzzleNumber }
          );
          postStreak(1, puzzleNumber);
          setStreak(1);
        }
        return true;
      }
    } else {
      log.debug(
        "GUESS ALREADY MADE: " + guess + "\n GUESSES: " + guesses.length
      );
    }
    return false;
  }

  // Sorts by the different metrics
  // possible metrics: similarity, guessCount, percentile, guess
  function sortGuesses(metric) {
    let newGuesses = [...guesses];
    if (metric === "guess") {
      newGuesses.sort((a, b) => a.guess.localeCompare(b.guess));
    } else {
      newGuesses.sort((a, b) => b[metric] - a[metric]);
    }
    setGuesses(newGuesses);
  }

  //deletes old guesses to ensure we do not pass the 6mb limit on android.
  async function sanatizeGuessCache(currentDay) {
    const keys = await cache.getAllKeys();
    //for each key
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      //check if the key contains 'model2'
      if (key.includes("model2")) {
        //if it does, remove it
        await cache.rawRemoveData(key);
        continue;
      }
      let numberString = "";
      for (let j = 0; j < key.length; j++) {
        if (key[j] >= "0" && key[j] <= "9") {
          numberString += key[j];
        }
      }
      if (numberString) {
        const num = parseInt(numberString);
        if (num < currentDay - 1) {
          await cache.rawRemoveData(key);
        }
      }
    }
  }

  async function getStreak(puzzleNumber = this.puzzleNumber) {
    const data = await cache.getData(
      "SEMANTLE_STREAK" + (i18n.locale === "en" ? "" : i18n.locale),
      false
    );
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
    Alert.alert("Reset all data?", "this will reset all your Semantle data.", [
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
    const data = await cache.getData(
      "SEMANTLE_STATS" + (i18n.locale === "en" ? "" : i18n.locale),
      false
    );
    if (data) {
      return data.daysMap;
    }
    return {};
  }

  async function editStats(newestGuess, isFound = false) {
    const data = await cache.getData(
      "SEMANTLE_STATS" + (i18n.locale === "en" ? "" : i18n.locale),
      false
    );
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
    cache.storeData(
      "SEMANTLE_STATS" + (i18n.locale === "en" ? "" : i18n.locale),
      { daysMap: daysMap }
    );
  }

  function getWinShareString() {
    //check if guesses contains the secret word, if so, return the index of the secret word
    const index = guesses.findIndex((g) => g.guess === secret);
    if (index === -1) {
      return i18n.t("Download Semantle");
    }
    //get guesses whose guessNumber is 0
    let temporallySorted = [...guesses];
    temporallySorted.sort((a, b) => a["guessCount"] - b["guessCount"]);
    const solutionIndex = temporallySorted.findIndex((g) => g.guess === secret);
    temporallySorted = temporallySorted.slice(0, solutionIndex + 1);
    if (temporallySorted.length == 0) {
      return "I haven't found any words yet!";
    }
    if (temporallySorted.length == 1) {
      return `${i18n.t("I solved Semantle")} #${puzzleNumber} ${i18n.t(
        "in only one guess"
      )}`;
    }
    function similarityString(guess) {
      return `${guess.similarity.toFixed(2)}%${
        guess.percentile ? ` (${guess.percentile}/1000)` : ""
      }`;
    }

    //get the first guess who has a non-null percentile
    let firstGuess = temporallySorted[0];
    let firstIn1000 = temporallySorted.find((g) => g.percentile !== null);
    const secondToLast = temporallySorted[temporallySorted.length - 2];
    let shareString = `${i18n.t("I solved Semantle")} #${puzzleNumber} ${i18n.t(
      "in"
    )} ${temporallySorted.length} ${i18n.t(
      "guesses My first guess had a similarity of"
    )} ${similarityString(firstGuess)}.`;
    if (firstIn1000.guessCount != 0) {
      shareString += ` ${i18n.t(
        "My first guess in the top 1000 was at guess"
      )} #${firstIn1000.guessCount + 1}.`;
    }
    shareString += ` ${i18n.t(
      "My penultimate guess had a similarity of"
    )} ${similarityString(secondToLast)}.`;
    return shareString;
  }

  async function getAndSetYesterdayClosest(day = puzzleNumber) {
    const yesterdaysWord = getYesterdaysWord(day);
    const yesterdayData = await getNearby(yesterdaysWord);
    setYesterdayClosest(yesterdayData);
  }

  async function initialize() {
    log.debug("initializing");
    // check to see if there is information cached.
    guessed = new Set();
    secretVec = null;

    setLastGuess(null);
    const day = getPuzzleNumber();
    setPuzzleNumber(day);
    sanatizeGuessCache(day);

    const secretWord = await fetchSecretWords(day, i18n.locale);
    const simStory = await fetchSimilarityStory(secretWord, day, i18n.locale);
    setSecret(secretWord);
    setSimilarityStory(simStory);

    const guessData = await cache.getData(
      "SEMANTLE_" + day + (i18n.locale === "en" ? "" : i18n.locale),
      false
    );
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
    log.debug(
      "Initialization Data: " +
        JSON.stringify({
          guesses: guesses,
          guessed: guessed,
          secretVec: secretVec,
          secretWord: secretWord,
          lastGuess: lastGuess,
          puzzleNumber: puzzleNumber,
          similarity: simStory,
          similarityStory: similarityStory,
          yesterdayClosest: yesterdayClosest,
          guessData: guessData,
          VERSION_CODE: VERSION_CODE,
          cacheString: "SEMANTLE_" + day,
        })
    );
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
    diagnosticsString += "VERSION: " + VERSION_CODE + "\n";
    diagnosticsString += "UserID: " + USER_ID + "\n";
    Clipboard.setString(diagnosticsString);
    return diagnosticsString;
  }

  function getYesterdaysWord(dayNumber = puzzleNumber) {
    const day = dayNumber - 1;
    const secretWord = SECRET_WORDS[day % SECRET_WORDS.length];
    return secretWord;
  }

  async function fillTestData(command) {
    //prompt user for number of days to fill
    const partitions = command.split("+");
    //parse string to int

    const daysToFill = parseInt(partitions[2]) || 1;
    const guessesPerDay = parseInt(partitions[1]) || 100;

    for (let j = 0; j < daysToFill; j++) {
      const testGuessData = [];
      for (let i = 0; i < guessesPerDay; i++) {
        //generate a random 5 character string
        let randomString = "";
        for (let j = 0; j < 5; j++) {
          randomString += String.fromCharCode(
            Math.floor(Math.random() * 26) + 97
          );
        }
        randomString += i;
        //generate a random similarity
        let randomSimilarity = Math.floor(Math.random() * 100);
        testGuessData.push({
          guess: randomString,
          similarity: randomSimilarity,
          percentile: null,
          guessCount: guesses.length + 1 + i,
        });
        if (j == 0) {
          setGuesses(testGuessData);
          guessed.add(randomString);
        }
      }
      await cache.storeData("SEMANTLE_" + (puzzleNumber - j), testGuessData);
    }
    const data = await cache.getData("SEMANTLE_STATS", false);
    var daysMap = data?.daysMap ? data.daysMap : {};
    for (let z = 0; z < daysToFill; z++) {
      const existingData =
        daysMap["STATS_DAY_" + (puzzleNumber - z).toString()] || {};
      existingData.found = false;
      existingData.day = puzzleNumber - z;
      existingData.numberOfGuesses = guessesPerDay;
      existingData.averageSimilarity = 0.42069;

      daysMap["STATS_DAY_" + (puzzleNumber - z).toString()] = existingData;
    }
    await cache.storeData("SEMANTLE_STATS", { daysMap: daysMap });
    Alert.alert(
      `Done filling ${daysToFill} days of data, with ${guessesPerDay} guesses per day.`
    );
  }

  function checkEasterEggs(guess = "") {
    guess = guess.toLowerCase();
    if (guess.includes("testdata")) {
      fillTestData(guess);
      return;
    }
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
    } else if (guess === "darktheme" || guess === "kamaradokodo") {
      return {
        place: "HOME",
        change: "THEME",
        text: "darktheme",
      };
    } else if (guess === "thomastheme") {
      return {
        place: "HOME",
        action: "hideStats",
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
    } else if (guess === "ethyl" || guess === "dog") {
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
    } else if (guess === "themecolor") {
      return {
        place: "HOME",
        action: "customColor",
      };
    } else if (guess === "testscreen") {
      return {
        place: "NAVIGATE",
        location: "TestTime",
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
