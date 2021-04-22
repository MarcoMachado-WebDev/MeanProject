const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Marco:'+process.env.MONGO_PW+'@cluster0.doec1.mongodb.net/node-angular?retryWrites=true&w=majority', {useNewUrlParser:true,useUnifiedTopology:true})
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection fail');
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'Get, POST, PATHC, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Accept, Authorization');
  next();
})

app.use("/images", express.static(path.join("images")))

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;