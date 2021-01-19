const { DateTime } = require('luxon');
const { body, query, param } = require('express-validator');
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
          throw Error('This username is already being used');
        }
        return true;
      }),
    // Email
    body('email')
      .isEmail().withMessage('Email must be valid')
      .custom(async (email) => {
        const user = await userService.findUserByEmail(email);
        if (user) {
          throw Error('This email address is already being used');
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
        return true;
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

exports.updateUserRules = () => {
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
          throw Error('This username is already being used');
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
          throw Error('This email address is already being used');
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
        return true;
      })
  ]
}

exports.tmdbSearchRules = () => {
  return [
    query('query')
      .isLength({ min: 1 }).withMessage('Query must be at least 1 character long'),
    query('page')
      .optional({ nullable: true })
      .isNumeric({ no_symbols: true }).withMessage('Page must be numeric')
      .isLength({ min: 1, max: 1000 }).withMessage('Page must be between 1 and 1000'),
    param('type')
      .custom((type) => {
        if (type !== 'movie' && type !== 'tv') {
          throw Error('Type must be movie or tv');
        }
        return true;
      })
  ]
}

exports.addMovieRules = () => {
  return [
    body('tmdbId')
      .isNumeric({ no_symbols: true }).withMessage('TMDb id must be numeric'),
    body('streamPath')
      .notEmpty().withMessage('Stream path must not be empty')
  ]
}

exports.addTvRules = () => {
  return [
    body('tmdbId')
      .isNumeric({ no_symbols: true }).withMessage('TMDb id must be numeric')
  ]
}

exports.addTvSeasonRules = () => {
  return [
    body('mediaId')
      .isNumeric({ no_symbols: true }).withMessage('Media id must be numeric'),
    body('season')
      .isNumeric({ no_symbols: true }).withMessage('Season number must be numeric')
  ]
}

exports.addTvEpisodeRules = () => {
  return [
    body('mediaId')
      .isNumeric({ no_symbols: true }).withMessage('Media id must be numeric'),
    body('season')
      .isNumeric({ no_symbols: true }).withMessage('Season number must be numeric'),
    body('episode')
      .isNumeric({ no_symbols: true }).withMessage('Episode number must be numeric'),
    body('streamPath')
      .notEmpty().withMessage('Stream path must not be empty')
  ]
}

exports.viewMediaRules = () => {
  return [
    query('exclude')
      .optional({ nullable: true })
      .isLength({ max: 250 }).withMessage('Exclusion string must be less than 250 characters long')
      .matches(/^[\w-.]+(?:,[\w-.]+)*$/).withMessage('Exclusion string must be valid')
  ]
}

exports.searchMediaRules = () => {
  return [
    query('query')
      .isLength({ min: 1 }).withMessage('Query must be at least 1 character long'),
    query('sort')
      .optional({ nullable: true })
      .isLength({ max: 250 }).withMessage('Sort string must be less than 250 characters long')
      .matches(/^[\w-.]+(?::-?[1]+)+(?:,[\w-.]+(?::-?[1]+))*$/).withMessage('Sort string must be valid'),
    query('page')
      .optional({ nullable: true })
      .isNumeric({ no_symbols: true }).withMessage('Page must be numeric')
      .isLength({ min: 1, max: 1000 }).withMessage('Page must be between 1 and 1000'),
    query('limit')
      .optional({ nullable: true })
      .isNumeric({ no_symbols: true }).withMessage('Limit must be numeric')
      .isLength({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ]
}

exports.fetchMediaRules = () => {
  return [
    query('sort')
      .optional({ nullable: true })
      .isLength({ max: 250 }).withMessage('Sort string must be less than 250 characters long')
      .matches(/^[\w-.]+(?::-?[1]+)+(?:,[\w-.]+(?::-?[1]+))*$/).withMessage('Sort string must be valid'),
    query('page')
      .optional({ nullable: true })
      .isNumeric({ no_symbols: true }).withMessage('Page must be numeric')
      .isLength({ min: 1, max: 1000 }).withMessage('Page must be between 1 and 1000'),
    query('limit')
      .optional({ nullable: true })
      .isNumeric({ no_symbols: true }).withMessage('Limit must be numeric')
      .isLength({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ]
}

exports.checkRatingRules = () => {
  return [
    param('id')
      .isNumeric({ no_symbols: true }).withMessage('Media id must be numeric')
  ]
}

exports.countRatingRules = () => {
  return [
    param('id')
      .isNumeric({ no_symbols: true }).withMessage('Media id must be numeric'),
    query('rating')
      .custom((rating) => {
        if (rating !== 'like' && rating !== 'dislike') {
          throw Error('Rating type must be like or dislike');
        }
        return true;
      })
  ]
}

exports.ratingRules = () => {
  return [
    param('id')
      .isNumeric({ no_symbols: true }).withMessage('Media id must be numeric'),
    body('rating')
      .custom((rating) => {
        if (rating !== 'like' && rating !== 'dislike' && rating !== 'none') {
          throw Error('Rating type must be like, dislike or none');
        }
        return true;
      })
  ]
}