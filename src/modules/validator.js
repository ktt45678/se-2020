const { body } = require('express-validator');
const userService = require('../services/user');

const registrationRules = () => {
  return [
    // Username
    body('username')
      .trim()
      .isAlphanumeric().withMessage('Username must be alphanumeric')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters long')
      .custom(async (username) => {
        const user = await userService.findUserByUsername(username);
        if (user) {
          throw Error('Username already exists');
        }
        return true;
      }),
    // Email
    body('email')
      .isEmail().withMessage('Email must be valid')
      .custom(async (email) => {
        const user = await userService.findUserByEmail(email);
        if (user) {
          throw Error('Email already exists');
        }
        return true;
      }),
    // Password
    body('password')
      .trim()
      .isLength({ min: 8, max: 100 }).withMessage('Password must be between 8 and 100 characters long')
      .custom((password, { req }) => {
        if (password != req.body.confirmPassword) {
          throw Error('Passwords do not match');
        }
        return true;
      }),
    // Display name
    body('displayName')
      .isLength({ max: 50 }).withMessage('Display name must be less than 50 characters long'),
    // Date of birth
    body('dateOfBirth')
      .isDate('dd-mm-yyyy').withMessage('Date of birth must be a valid date in dd-mm-yyyy format')
  ]
}

const loginRules = () => {
  return [
    body('username')
      .notEmpty().withMessage('Username must not be empty')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password')
      .notEmpty().withMessage('Password must not be empty')
      .isLength({ min: 8, max: 100 }).withMessage('Password must be between 8 and 100 characters long')
  ]
}

const recoveryRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Email must be valid'),
  ]
}

const resetPasswordRules = () => {
  return [
    body('recoveryCode')
      .notEmpty().withMessage('Recovery code must not be empty'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 100 }).withMessage('Password must be between 8 and 100 characters long')
      .custom((password, { req }) => {
        if (password != req.body.confirmPassword) {
          throw Error('Passwords do not match');
        }
        return true;
      })
  ]
}

module.exports = { registrationRules, loginRules, recoveryRules, resetPasswordRules }