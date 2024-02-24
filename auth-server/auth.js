// const express = require("express");
// const app = express();
// require("dotenv").config();

// app.listen(9001, () => {
//   console.log("Auth server is running on port 9001");
// });

// const users = [
//   {
//     username: "john",
//     password: "password123admin",
//     role: "admin",
//   },
//   {
//     username: "anna",
//     password: "password123member",
//     role: "member",
//   },
// ];

// const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");

// app.use(bodyParser.json());

// const clientSecret = process.env.CLIENT_SECRET;

// app.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   const user = users.find((u) => {
//     return u.username === username && u.password === password;
//   });
  
//   if (user) {
//     const accerssToken = jwt.sign(
//       { username: user.username, role: user.role },
//       clientSecret
//     );
//     res.json({
//       accessToken: accerssToken,
//     });
//   } else {
//     res.status(400).send("Username or password incorrect");
//   }
// });
