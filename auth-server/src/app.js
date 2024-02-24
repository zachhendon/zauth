const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const userRouter = require("./routes/userRoute");
const tokenRouter = require("./routes/tokenRoute")

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use(express.json());

app.use("/user", userRouter);
app.use("/token", tokenRouter)

const httpsOptions = {
  key: fs.readFileSync("./src/certs/key.pem"),
  cert: fs.readFileSync("./src/certs/cert.pem"),
};

https
  .createServer(httpsOptions, app)
  .listen(PORT, () => console.log(`Listening on port ${PORT}!`));
