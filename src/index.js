require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://data-team:123456%40Sabai@cluster0.wtf03.mongodb.net/rbac"
);

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("./public"));

const authRoute = require("./routes/auth.route");
const adminRoute = require("./routes/admin.route");
const categoryRoute = require("./routes/common.route");
app.use("/api/v1", authRoute);
app.use("/api/v1", adminRoute);
app.use("/api/v1", categoryRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`rbac is running on http://localhost:${port}`);
});
