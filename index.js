require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const jsonParser = express.json();

app.use(cors());
app.use(jsonParser);

app.listen(port, () => console.log("Listening to port", port));
