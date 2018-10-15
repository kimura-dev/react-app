const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLessonInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Lesson title is required'
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required'
  }

  // Check to see if it is not empty, then we want to do our validator check
  // if (!isEmpty(data.data.videos.url)) {
  //   if (!Validator.isURL(data.data.videos.url)) {
  //     errors.videos.url = 'Not a valid URL';
  //   }
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};