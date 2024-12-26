require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/rbac")

const express = require('express')
const app = express();
app.use(express.static('./public'))

const port = process.env.PORT||4000;

app.listen(port,()=>{
    console.log(`rbac is running on PORT:: ${port}`)
});