import client from "./client";

//returns the 10 nearest words.
async function getNearby(word) {
  const url = "nearby/" + word;
  const response = await client.get(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function getModel(word, secret) {
  const url = "model2/" + secret + "/" + word.replace(/\ /gi, "_");
  const response = await client.get(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function getSimilarityStory(secret) {
  const url = BASE_URL + "similarity/" + secret;
  const response = await client.get(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

export default {
  getNearby,
  getModel,
  getSimilarityStory,
};
