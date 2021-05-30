import io from "socket.io-client";
const config = require("../config");
const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/"
    : `${config.prodHost}`;
console.log(process.env.NODE_ENV, HOST);
export default io(HOST, { transports: ["websocket"] });
