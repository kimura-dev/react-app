const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCourseInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.price = !isEmpty(data.price) ? data.price : '';


  if (Validator.isEmpty(data.title)) {
    errors.title = 'Course title is required'
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required'
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = 'Course price is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};