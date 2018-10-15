'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const port = process.env.PORT || 8080;

// Load Courses Model
const {
  Course
} = require('./models/Course');

// Lessons Model
const {
  Lesson
} = require('./models/Lesson');


// Load Routers
const usersRouter = require('./routes/api/users');
const courseRouter = require('./routes/api/course');
const lessonRouter = require('./routes/api/lesson');

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// DB Config
const {
  DATABASE_URL
} = require('./config/keys');

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport.js')(passport);


// Use Routes
app.use('/api/users/', usersRouter);
app.use('/api/course/', courseRouter);
app.use('/api/lesson/', lessonRouter);


// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(dburl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true
    }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {
  app,
  runServer,
  closeServer
};