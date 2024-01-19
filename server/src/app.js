const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user");
const listRouter = require("./routes/list");
const taskRouter = require("./routes/task");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/user", userRouter);
app.use("/list", listRouter);
app.use("/task", taskRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
