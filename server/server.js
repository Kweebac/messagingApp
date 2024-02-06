const express = require("express");
const app = express();
const cors = require("cors");

require("./mongooseConfig");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.listen(3000);
