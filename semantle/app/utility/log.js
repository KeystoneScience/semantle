import client from "../api/client";
import cache from "../utility/cache";

var USER_ID = null;

const customTransport = (props) => {
  handleTransport(props);
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
