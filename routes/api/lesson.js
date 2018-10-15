const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Profile Model
const Lesson = require('../../models/Lesson');

// Post Model
// const Course = require('../../models/Course');

// Validation
const validateLessonInput = require('../../validation/lesson');

// @route     GET api/lesson
// @desc      GET lessons
// @access    Public
router.get('/', (req, res) => {
  Lesson.find()
    .then(lessons => res.json(lessons))
    .catch(err => res.status(404).json({
      nolessonsfound: 'No lessons found'
    }));
});

// @route     GET api/lesson/:id
// @desc      GET a single lesson by id
// @access    Public
router.get('/:id', (req, res) => {
  Lesson.findById(req.params.id)
    .then(lesson => res.json(lesson))
    .catch(err => res.status(404).json({
      nolessonfound: 'No lesson found with that ID'
    }));
});

// @route     POST api/lesson
// @desc      Create Lesson
// @access    Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateLessonInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }
  const newLesson = new Lesson({
    title: req.body.title,
    description: req.body.description,
    // video: req.body.videos
  });

  newLesson.save().then(lesson => res.json(lesson));
});

// @route     DELETE api/lesson/:id
// @desc      Delete Lesson
// @access    Private
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Lesson.findById(req.params.id)
    .then(lesson => {
      //Check to make sure lesson owner
      // if (lesson.user.toString() !== req.user.id) {
      //   return res.status(401).json({
      //     notAuthorized: 'User not authorized'
      //   });
      // }

      // Delete
      lesson.remove().then(() => res.json({
        success: true
      }));
    })
    .catch(err => res.status(404).json({
      lessonnotfound: 'No lesson found'
    }))
  // Lesson.findOne({
  //     user: req.body.id
  //   })
  //   .then(lesson => {
  //     Lesson.findById(req.params.id)
  //       .then(lesson => {
  //         //Check to make sure lesson owner
  //         if (lesson.user.toString() !== req.user.id) {
  //           return res.status(401).json({
  //             notAuthorized: 'User not authorized'
  //           });
  //         }

  //         // Delete
  //         lesson.remove().then(() => res.json({
  //           success: true
  //         }));
  //       })
  //       .catch(err => res.status(404).json({
  //         lessonnotfound: 'No lesson found'
  //       }))
  //   })
});

// @route     POST api/posts/comment/:post_id
// @desc      ADD Comment to Post
// @access    Private
router.post('/comment/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  Lesson.findById(req.params.id)
    .then(lesson => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      lesson.addComment(newComment).then(lesson => res.json(lesson));
    })
    .catch(err => res.status(404).json({
      lessonnotfound: 'No lesson found'
    }))
});

// @route     DELETE api/lesson/comment/:lesson_id/:comment_id
// @desc      Remove Comment from Post
// @access    Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Lesson.findById(req.params.id)
    .then(lesson => {
      // Check to see if the comment exists
      if (lesson.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({
          commentnotfound: 'Comment does not exist'
        });
      }

      // Get the comment to remove
      const removeIndex = lesson.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      // Splice out of array
      lesson.comments.splice(removeIndex, 1);

      // Save
      lesson.save().then(post => res.json(post));

    })
    .catch(err => res.status(404).json({
      postnotfound: 'No lesson found'
    }))
})


module.exports = router;