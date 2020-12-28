const { DateTime } = require('luxon');
const { body } = require('express-validator');
const userService = require('../services/user');

exports.registrationRules = () => {
  return [
    // Username
    body('username')
      .trim()
      .isAlphanumeric().withMessage('Username must be alphanumeric')
      .isLength({ min: 3, max: 32 }).withMessage('Username must be between 3 and 32 characters long')
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
      .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters long')
      .custom((password, { req }) => {
        if (password != req.body.confirmPassword) {
          throw Error('Passwords do not match');
        }
        return true;
      }),
    // Display name
    body('displayName')
      .trim()
      .isLength({ max: 32 }).withMessage('Display name must be less than 32 characters long'),
    // Date of birth
    body('dateOfBirth')
      .isDate('DD-MM-YYYY').withMessage('Date of birth must be a valid date in DD-MM-YYYY format')
      .custom((dateOfBirth) => {
        const date = DateTime.fromFormat(dateOfBirth, 'dd-MM-yyyy');
        if (date > DateTime.local()) {
          throw Error('Date of birth must not be after the current date');
        }
        return true
      })
  ]
}

exports.loginRules = () => {
  return [
    body('username')
      .trim()
      .isLength({ min: 3, max: 32 }).withMessage('Username must be between 3 and 32 characters long'),
    body('password')
      .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters long')
  ]
}

exports.recoveryRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Email must be valid'),
  ]
}

exports.resetPasswordRules = () => {
  return [
    body('recoveryCode')
      .notEmpty().withMessage('Recovery code must not be empty'),
    body('password')
      .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters long')
      .custom((password, { req }) => {
        if (password != req.body.confirmPassword) {
          throw Error('Passwords do not match');
        }
        return true;
      })
  ]
}

exports.userUpdateRules = () => {
  return [
    body('username')
      .trim()
      .isAlphanumeric().withMessage('Username must be alphanumeric')
      .isLength({ min: 3, max: 32 }).withMessage('Username must be between 3 and 32 characters long')
      .custom(async (username, { req }) => {
        if (req.currentUser.username === username) {
          return true;
        }
        const user = await userService.findUserByUsername(username);
        if (user) {
          throw Error('Username already exists');
        }
        return true;
      }),
    body('email')
      .isEmail().withMessage('Email must be valid')
      .custom(async (email, { req }) => {
        if (req.currentUser.email === email) {
          return true;
        }
        const user = await userService.findUserByEmail(email);
        if (user) {
          throw Error('Email already exists');
        }
        return true;
      }),
    body('newPassword')
      .custom((newPassword, { req }) => {
        if (newPassword) {
          if (newPassword.length < 8 || newPassword.length > 128) {
            throw Error('Password must be between 8 and 128 characters long');
          }
          if (newPassword != req.body.confirmPassword) {
            throw Error('Passwords do not match');
          }
        }
        return true;
      }),
    body('displayName')
      .trim()
      .isLength({ max: 32 }).withMessage('Display name must be less than 32 characters long'),
    body('dateOfBirth')
      .isDate('DD-MM-YYYY').withMessage('Date of birth must be a valid date in DD-MM-YYYY format')
      .custom((dateOfBirth) => {
        const date = DateTime.fromFormat(dateOfBirth, 'dd-MM-yyyy');
        if (date > DateTime.local()) {
          throw Error('Date of birth must not be after the current date');
        }
        return true
      })
  ]
}