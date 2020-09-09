require("dotenv").config();
const express = require("express");
// const authRouter = require("./router/auth");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const jsonParser = express.json();

app.use(cors());
app.use(jsonParser);
// app.use("/auth", authRouter);

app.listen(port, () => console.log("Listening to port", port));
