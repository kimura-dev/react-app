const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Profile Model
const {
  Course
} = require('../../models/Course');

// Validation
const validateCourseInput = require('../../validation/course');

// @route     GET api/course
// @desc      GET courses
// @access    Public
router.get('/', (req, res) => {
  Course.find()
    .then(courses => res.json(courses))
    .catch(err => res.status(404).json({
      nolessonsfound: 'No courses found'
    }));
});

// @route     GET api/course/:id
// @desc      GET a single course by id
// @access    Public
router.get('/:id', (req, res) => {
  Course.findById(req.params.id)
    .then(course => res.json(course))
    .catch(err => res.status(404).json({
      nolessonfound: 'No course found with that ID'
    }));
});

// @route     POST api/course
// @desc      Create Course
// @access    Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateCourseInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }
  const newCourse = new Course({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  });

  newCourse.save().then(course => res.json(course))
    .catch(err => {
      console.log(err);
    })
});

// @route     PUT api/course/:id
// @desc      Edit Course
// @access    Private
router.put('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Course.findByIdAndUpdate(req.params.id, {

    ...req.body
  }, {
    new: true
  }).then((data) => {
    // console.log(data);
    res.status(200).json(data);
  }).catch((err) => {
    console.log(err);
    if (err.name === 'ValidationError') {
      return res.status(422).json({
        message: err.message,
        kind: err.kind,
        path: err.path,
        value: err.value
      });
    }
    res.status(400).json({
      message: 'Failed to update course'
    });
  });

});

// @route     DELETE api/course/:id
// @desc      Delete Course
// @access    Private
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Course.findById(req.params.id)
    .then(course => {
      //Check to make sure post owner
      // if (course.user.toString() !== req.user.id) {
      //   return res.status(401).json({
      //     notAuthorized: 'User not authorized'
      //   });
      // }

      // Delete
      course.remove().then(() => res.json({
        success: true
      }));
    })
    .catch(err => res.status(404).json({
      coursenotfound: 'No course found'
    }))
});

module.exports = router;