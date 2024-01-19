const express = require("express");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use("/", indexRouter);
app.use("/user", usersRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
