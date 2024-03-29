const { DateTime } = require('luxon');
const { body, query, param } = require('express-validator');
const userService = require('../services/user');
const watchlistService = require('../services/watchlist');

exports.registrationRules = () => {
  return [
    // Username
    body('username')
      .trim()
      .isAlphanumeric().withMessage('Username must be alphanumeric')
      .isLength({ min: 3, max: 32 }).withMessage('Username must be between 3 and 32 characters long')
      .bail()
      .custom(async (username) => {
        try {
          var user = await userService.findUserByUsername(username);
        } catch (e) {
          console.error(e);
          throw Error('Internal server error')
        }
        if (user) {
          throw Error('This username is already being used');
        }
        return true;
      }),
    // Email
    body('email')
      .isEmail().withMessage('Email must be valid')
      .bail()
      .custom(async (email) => {
        try {
          var user = await userService.findUserByEmail(email);
        } catch (e) {
          console.error(e);
          throw Error('Internal server error')
        }
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
      .isLength({ max: 32 }).withMessage('Display name must not be longer than 32 characters long'),
    // Date of birth
    body('dateOfBirth')
      .isDate({ format: 'DD-MM-YYYY', strictMode: true }).withMessage('Date of birth must be a valid date in DD-MM-YYYY format')
      .bail()
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
      .isEmail().withMessage('Email must be valid')
  ]
}

exports.resetPasswordRules = () => {
  return [
    body('recoveryCode')
      .notEmpty().withMessage('Recovery code must not be empty'),
    body('password')
      .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters long')
      .bail()
      .custom((password, { req }) => {
        if (password != req.body.confirmPassword) {
          throw Error('Passwords do not match');
        }
        return true;
      })
  ]
}

exports.viewUserRules = () => {
  return [
    param('id')
      .optional()
      .toInt()
      .isInt({ min: 1 }).withMessage('User id must be a positive integer')
  ]
}

exports.updateUserRules = () => {
  return [
    body('username')
      .trim()
      .isAlphanumeric().withMessage('Username must be alphanumeric')
      .isLength({ min: 3, max: 32 }).withMessage('Username must be between 3 and 32 characters long')
      .bail()
      .if((username, { req }) => username !== req.currentUser?.username)
      .custom(async (username) => {
        try {
          var user = await userService.findUserByUsername(username);
        } catch (e) {
          console.error(e);
          throw Error('Internal server error')
        }
        if (user) {
          throw Error('This username is already being used');
        }
        return true;
      }),
    body('email')
      .isEmail().withMessage('Email must be valid')
      .bail()
      .if((email, { req }) => email !== req.currentUser?.email)
      .custom(async (email) => {
        try {
          var user = await userService.findUserByEmail(email);
        } catch (e) {
          console.error(e);
          throw Error('Internal server error')
        }
        if (user) {
          throw Error('This email address is already being used');
        }
        return true;
      }),
    body('newPassword')
      .optional()
      .isLength({ min: 8, max: 128 }).withMessage('New password must be between 8 and 128 characters long')
      .bail()
      .custom((newPassword, { req }) => {
        if (newPassword != req.body.confirmPassword) {
          throw Error('New passwords do not match');
        }
        return true;
      }),
    body('displayName')
      .trim()
      .isLength({ max: 32 }).withMessage('Display name must not be longer than 32 characters long'),
    body('dateOfBirth')
      .isDate({ format: 'DD-MM-YYYY', strictMode: true }).withMessage('Date of birth must be a valid date in DD-MM-YYYY format')
      .bail()
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
      .optional()
      .toInt()
      .isInt({ min: 1, max: 1000 }).withMessage('Page must be between 1 and 1000'),
    param('type')
      .isIn(['movie', 'tv']).withMessage('Type must be movie or tv')
  ]
}

exports.addMovieRules = () => {
  return [
    body('tmdbId')
      .optional()
      .toInt()
      .isInt({ min: 0 }).withMessage('TMDb id must be a positive integer or 0'),
    body('streamPath')
      .isLength({ min: 1, max: 1000 }).withMessage('Stream path must be between 1 and 1000 characters long'),
    body('isPublic')
      .toBoolean(true),
    body('override')
      .optional()
      .if((_, { req }) => req.is('application/x-www-form-urlencoded'))
      .isJSON().withMessage('Override must be a valid json string')
      .bail()
      .customSanitizer(override => {
        override = JSON.parse(override);
        return override;
      }),
    body('override.title')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Title must not be longer than 128 characters long'),
    body('override.originalTitle')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Original title must not be longer than 128 characters long'),
    body('override.tagline')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Tagline must not be longer than 128 characters long'),
    body('override.overview')
      .optional({ nullable: true })
      .isLength({ min: 10, max: 1000 }).withMessage('Overview must be between 10 and 1000 characters long'),
    body('override.posterPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Poster path must not be longer than 2000 characters long'),
    body('override.backdropPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Backdrop path must not be longer than 2000 characters long'),
    body('override.movie.runtime')
      .optional({ nullable: true })
      .toInt()
      .isInt({ min: 0 }).withMessage('Runtime must be a positive integer or 0'),
    body('override.movie.releaseDate')
      .optional({ nullable: true })
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Release date must be a valid date in YYYY-MM-DD format'),
    body('override.movie.status')
      .optional({ nullable: true })
      .isLength({ max: 32 }).withMessage('Status must not be longer than 32 characters long'),
    body('override.movie.adult')
      .optional({ nullable: true })
      .isBoolean().withMessage('Movie adult flag must be a boolean')
      .toBoolean(true),
    body('override.genres')
      .optional({ nullable: true })
      .isArray({ max: 64 }).withMessage('Genres must be an array and up to 64 items')
      .bail()
      .custom(genres => {
        const size = genres.length;
        for (let i = 0; i < size; i++) {
          if (typeof genres[i] !== 'string') {
            throw Error('Genres must be an array of strings');
          }
        }
        return true;
      }),
    body('override.popularity')
      .optional({ nullable: true })
      .toFloat()
      .isFloat().withMessage('Popularity must be a float')
  ]
}

exports.addTvRules = () => {
  return [
    body('tmdbId')
      .optional()
      .toInt()
      .isInt({ min: 0 }).withMessage('TMDb id must be a positive  or 0'),
    body('isPublic')
      .toBoolean(true),
    body('override')
      .optional()
      .if((_, { req }) => req.is('application/x-www-form-urlencoded'))
      .isJSON().withMessage('Override must be a valid json string')
      .bail()
      .customSanitizer(override => {
        override = JSON.parse(override);
        return override;
      }),
    body('override.title')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Title must not be longer than 128 characters long'),
    body('override.originalTitle')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Original title must not be longer than 128 characters long'),
    body('override.tagline')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Tagline must not be longer than 128 characters long'),
    body('override.overview')
      .optional({ nullable: true })
      .isLength({ min: 10, max: 1000 }).withMessage('Overview must be between 10 and 1000 characters long'),
    body('override.posterPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Poster path must not be longer than 2000 characters long'),
    body('override.backdropPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Backdrop path must not be longer than 2000 characters long'),
    body('override.tvShow.episodeRuntime')
      .optional({ nullable: true })
      .isArray({ max: 100 }).withMessage('Episode runtime must be an array and up to 100 items')
      .bail()
      .custom(episodeRuntime => {
        const size = episodeRuntime.length;
        for (let i = 0; i < size; i++) {
          if (typeof episodeRuntime[i] !== 'number') {
            throw Error('Episode runtime must be an array of numbers');
          }
        }
        return true;
      }),
    body('override.tvShow.firstAirDate')
      .if(body('override.tvShow.lastAirDate').exists({ checkNull: true }))
      .notEmpty().withMessage('First air date is required if the last air date is available')
      .bail()
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('First air date must be a valid date in YYYY-MM-DD format'),
    body('override.tvShow.lastAirDate')
      .if(body('override.tvShow.firstAirDate').exists({ checkNull: true }))
      .notEmpty().withMessage('Last air date is required if the first air date is available')
      .bail()
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Last air date must be a valid date in YYYY-MM-DD format')
      .custom((lastAirDate, { req }) => {
        const firstDate = DateTime.fromFormat(req.body.override.tvShow.firstAirDate, 'yyyy-MM-dd');
        const lastDate = DateTime.fromFormat(lastAirDate, 'yyyy-MM-dd');
        if (firstDate > lastDate) {
          throw Error('First air date must not be after the last air date');
        }
        return true;
      }),
    body('override.tvShow.status')
      .optional({ nullable: true })
      .isLength({ max: 32 }).withMessage('Status must not be longer than 32 characters long'),
    body('override.genres')
      .optional({ nullable: true })
      .isArray({ max: 64 }).withMessage('Genres must be an array and up to 64 items')
      .bail()
      .custom(genres => {
        const size = genres.length;
        for (let i = 0; i < size; i++) {
          if (typeof genres[i] !== 'string') {
            throw Error('Genres must be an array of strings');
          }
        }
        return true;
      }),
    body('override.popularity')
      .optional({ nullable: true })
      .toFloat()
      .isFloat().withMessage('Popularity must be a float')
  ]
}

exports.addAndUpdateTvSeasonRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('season')
      .toInt()
      .isInt().withMessage('Season number must be an integer or 0'),
    body('isPublic')
      .toBoolean(true),
    body('override')
      .optional()
      .if((_, { req }) => req.is('application/x-www-form-urlencoded'))
      .isJSON().withMessage('Override must be a valid json string')
      .bail()
      .customSanitizer(override => {
        override = JSON.parse(override);
        return override;
      }),
    body('override.airDate')
      .optional({ nullable: true })
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Air date must be a valid date in YYYY-MM-DD format'),
    body('override.name')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Name must not be longer than 128 characters long'),
    body('override.overview')
      .optional({ nullable: true })
      .isLength({ min: 10, max: 1000 }).withMessage('Overview must be between 10 and 1000 characters long'),
    body('override.posterPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Poster path must not be longer than 2000 characters long')
  ]
}

exports.addAndUpdateTvEpisodeRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('season')
      .toInt()
      .isInt().withMessage('Season number must be an integer'),
    body('episode')
      .toInt()
      .isInt().withMessage('Episode number must be an integer'),
    body('streamPath')
      .isLength({ min: 1, max: 1000 }).withMessage('Stream path must be between 1 and 1000 characters long'),
    body('isPublic')
      .toBoolean(true),
    body('override')
      .optional()
      .if((_, { req }) => req.is('application/x-www-form-urlencoded'))
      .isJSON().withMessage('Override must be a valid json string')
      .bail()
      .customSanitizer(override => {
        override = JSON.parse(override);
        return override;
      }),
    body('override.runtime')
      .optional({ nullable: true })
      .toInt()
      .isInt({ min: 0 }).withMessage('Runtime must be a positive integer or 0'),
    body('override.name')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Name must not be longer than 128 characters long'),
    body('override.overview')
      .optional({ nullable: true })
      .isLength({ min: 10, max: 1000 }).withMessage('Overview must be between 10 and 1000 characters long'),
    body('override.airDate')
      .optional({ nullable: true })
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Air date must be a valid date in YYYY-MM-DD format'),
    body('override.stillPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Still path must not be longer than 2000 characters long')
  ]
}

exports.updateMovieRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('streamPath')
      .isLength({ min: 1, max: 1000 }).withMessage('Stream path must be between 1 and 1000 characters long'),
    body('isPublic')
      .toBoolean(true),
    body('override')
      .optional()
      .if((_, { req }) => req.is('application/x-www-form-urlencoded'))
      .isJSON().withMessage('Override must be a valid json string')
      .bail()
      .customSanitizer(override => {
        override = JSON.parse(override);
        return override;
      }),
    body('override.title')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Title must not be longer than 128 characters long'),
    body('override.originalTitle')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Original title must not be longer than 128 characters long'),
    body('override.tagline')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Tagline must not be longer than 128 characters long'),
    body('override.overview')
      .optional({ nullable: true })
      .isLength({ min: 10, max: 1000 }).withMessage('Overview must be between 10 and 1000 characters long'),
    body('override.posterPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Poster path must not be longer than 2000 characters long'),
    body('override.backdropPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Backdrop path must not be longer than 2000 characters long'),
    body('override.movie.runtime')
      .optional({ nullable: true })
      .toInt()
      .isInt({ min: 0 }).withMessage('Runtime must be a positive integer or 0'),
    body('override.movie.releaseDate')
      .optional({ nullable: true })
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Release date must be a valid date in YYYY-MM-DD format'),
    body('override.movie.status')
      .optional({ nullable: true })
      .isLength({ max: 32 }).withMessage('Status must not be longer than 32 characters long'),
    body('override.movie.adult')
      .optional({ nullable: true })
      .isBoolean().withMessage('Movie adult flag must be a boolean')
      .toBoolean(true),
    body('override.genres')
      .optional({ nullable: true })
      .isArray({ max: 64 }).withMessage('Genres must be an array and up to 64 items')
      .bail()
      .custom(genres => {
        const size = genres.length;
        for (let i = 0; i < size; i++) {
          if (typeof genres[i] !== 'string') {
            throw Error('Genres must be an array of strings');
          }
        }
        return true;
      }),
    body('override.popularity')
      .optional({ nullable: true })
      .toFloat()
      .isFloat().withMessage('Popularity must be a float')
  ]
}

exports.updateTvRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('isPublic')
      .toBoolean(true),
    body('override')
      .optional()
      .if((_, { req }) => req.is('application/x-www-form-urlencoded'))
      .isJSON().withMessage('Override must be a valid json string')
      .bail()
      .customSanitizer(override => {
        override = JSON.parse(override);
        return override;
      }),
    body('override.title')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Title must not be longer than 128 characters long'),
    body('override.originalTitle')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Original title must not be longer than 128 characters long'),
    body('override.tagline')
      .optional({ nullable: true })
      .isLength({ max: 128 }).withMessage('Tagline must not be longer than 128 characters long'),
    body('override.overview')
      .optional({ nullable: true })
      .isLength({ min: 10, max: 1000 }).withMessage('Overview must be between 10 and 1000 characters long'),
    body('override.posterPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Poster path must not be longer than 2000 characters long'),
    body('override.backdropPath')
      .optional({ nullable: true })
      .isLength({ max: 2000 }).withMessage('Backdrop path must not be longer than 2000 characters long'),
    body('override.tvShow.episodeRuntime')
      .optional({ nullable: true })
      .isArray({ max: 100 }).withMessage('Episode runtime must be an array and up to 100 items')
      .bail()
      .custom(episodeRuntime => {
        const size = episodeRuntime.length;
        for (let i = 0; i < size; i++) {
          if (typeof episodeRuntime[i] !== 'number') {
            throw Error('Episode runtime must be an array of numbers');
          }
        }
        return true;
      }),
    body('override.tvShow.firstAirDate')
      .if(body('override.tvShow.lastAirDate').exists({ checkNull: true }))
      .notEmpty().withMessage('First air date is required if the last air date is available')
      .bail()
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('First air date must be a valid date in YYYY-MM-DD format'),
    body('override.tvShow.lastAirDate')
      .if(body('override.tvShow.firstAirDate').exists({ checkNull: true }))
      .notEmpty().withMessage('Last air date is required if the first air date is available')
      .bail()
      .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Last air date must be a valid date in YYYY-MM-DD format')
      .custom((lastAirDate, { req }) => {
        const firstDate = DateTime.fromFormat(req.body.override.tvShow.firstAirDate, 'yyyy-MM-dd');
        const lastDate = DateTime.fromFormat(lastAirDate, 'yyyy-MM-dd');
        if (firstDate > lastDate) {
          throw Error('First air date must not be after the last air date');
        }
        return true;
      }),
    body('override.tvShow.status')
      .optional({ nullable: true })
      .isLength({ max: 32 }).withMessage('Status must not be longer than 32 characters long'),
    body('override.genres')
      .optional({ nullable: true })
      .isArray({ max: 64 }).withMessage('Genres must be an array and up to 64 items')
      .bail()
      .custom(genres => {
        const size = genres.length;
        for (let i = 0; i < size; i++) {
          if (typeof genres[i] !== 'string') {
            throw Error('Genres must be an array of strings');
          }
        }
        return true;
      }),
    body('override.popularity')
      .optional({ nullable: true })
      .toFloat()
      .isFloat().withMessage('Popularity must be a float')
  ]
}

exports.deleteMediaRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer')
  ]
}

exports.deleteTvSeasonRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('season')
      .toInt()
      .isInt().withMessage('Season number must be an integer')
  ]
}

exports.deleteTvEpisodeRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('season')
      .toInt()
      .isInt().withMessage('Season number must be an integer'),
    body('episode')
      .toInt()
      .isInt().withMessage('Episode number must be an integer')
  ]
}

exports.viewMediaRules = () => {
  return [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    query('fields')
      .optional()
      .isLength({ max: 320 }).withMessage('Field string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w-.]+(?:,[\w-.]+)*$/).withMessage('Field string must be valid')
  ]
}

exports.viewLatestMediaRules = () => {
  return [
    query('type')
      .optional()
      .isIn(['movie', 'tv']).withMessage('Type must be movie or tv'),
    query('fields')
      .optional()
      .isLength({ max: 320 }).withMessage('Field string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w-.]+(?:,[\w-.]+)*$/).withMessage('Field string must be valid')
  ]
}

exports.viewTvSeasonRules = () => {
  return [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    param('season')
      .toInt()
      .isInt().withMessage('Season number must be an integer'),
    query('fields')
      .optional()
      .isLength({ max: 320 }).withMessage('Field string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w-.]+(?:,[\w-.]+)*$/).withMessage('Field string must be valid')
  ]
}

exports.viewTvEpisodeRules = () => {
  return [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    param('season')
      .toInt()
      .isInt().withMessage('Season number must be an integer'),
    param('episode')
      .toInt()
      .isInt().withMessage('Season number must be an integer'),
    query('fields')
      .optional()
      .isLength({ max: 320 }).withMessage('Field string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w-.]+(?:,[\w-.]+)*$/).withMessage('Field string must be valid')
  ]
}

exports.fetchMediaRules = () => {
  return [
    query('query')
      .optional()
      .isLength({ min: 1 }).withMessage('Query must be at least 1 character long')
      .bail()
      .customSanitizer(query => {
        return decodeURIComponent(query);
      }),
    query('type')
      .optional()
      .isIn(['movie', 'tv']).withMessage('Type must be movie or tv'),
    query('sort')
      .optional()
      .isLength({ max: 320 }).withMessage('Sort string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w\.]+(?:\,[\<\>][\w\.]+)*$/).withMessage('Sort string must be valid'),
    query('page')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 10000 }).withMessage('Page must be an integer between 1 and 10000'),
    query('limit')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 50 }).withMessage('Limit must be an integer between 1 and 50')
  ]
}

exports.checkRatingRules = () => {
  return [
    param('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer')
  ]
}

exports.countRatingRules = () => {
  return [
    param('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer')
  ]
}

exports.ratingRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('rating')
      .isIn(['like', 'dislike', 'none']).withMessage('Rating type must be like, dislike or none')
  ]
}

exports.streamRules = () => {
  return [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    query('season')
      .optional()
      .toInt()
      .isInt().withMessage('Season number must be an integer'),
    query('episode')
      .optional()
      .toInt()
      .isInt().withMessage('Episode number must be an integer')
  ]
}

exports.fetchWatchlistRules = () => {
  return [
    query('sort')
      .optional()
      .isLength({ max: 320 }).withMessage('Sort string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w\.]+(?:\,[\<\>][\w\.]+)*$/).withMessage('Sort string must be valid'),
    query('page')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 10000 }).withMessage('Page must be an integer between 1 and 10000'),
    query('limit')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 50 }).withMessage('Limit must be an integer between 1 and 50')
  ]
}

exports.checkWatchlistRules = () => {
  return [
    param('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer')
  ]
}

exports.addToWatchlistRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer')
      .custom(async (mediaId, { req }) => {
        try {
          var media = await watchlistService.findByUserAndMedia(req.currentUser._id, mediaId);
        } catch (e) {
          console.error(e);
          throw Error('Internal server error')
        }
        if (media) {
          throw Error('Media has already been added');
        }
        return true;
      })
  ]
}

exports.deleteFromWatchlistRules = () => {
  return [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('Id must be a positive integer')
  ]
}

exports.fetchHistoryRules = () => {
  return [
    query('sort')
      .optional()
      .isLength({ max: 320 }).withMessage('Sort string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w\.]+(?:\,[\<\>][\w\.]+)*$/).withMessage('Sort string must be valid'),
    query('page')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 10000 }).withMessage('Page must be an integer between 1 and 10000'),
    query('limit')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 50 }).withMessage('Limit must be an integer between 1 and 50')
  ]
}

exports.getHistoryRules = () => {
  return [
    param('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer')
  ]
}

exports.addHistoryRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer')
  ]
}

exports.fetchCommentRules = () => {
  return [
    param('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    query('sort')
      .optional()
      .isLength({ max: 320 }).withMessage('Sort string must not be longer than 320 characters long')
      .bail()
      .matches(/^[\<\>][\w\.]+(?:\,[\<\>][\w\.]+)*$/).withMessage('Sort string must be valid'),
    query('page')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 10000 }).withMessage('Page must be an integer between 1 and 10000'),
    query('limit')
      .optional()
      .toInt()
      .isInt({ min: 1, max: 50 }).withMessage('Limit must be an integer between 1 and 50')
  ]
}

exports.addCommentRules = () => {
  return [
    body('mediaId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Media id must be a positive integer'),
    body('content')
      .isLength({ min: 1, max: 2000 }).withMessage('Content must be between 1 and 2000 characters long')
  ]
}

exports.updateCommentRules = () => {
  return [
    body('commentId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Comment id must be a positive integer'),
    body('content')
      .isLength({ min: 1, max: 2000 }).withMessage('Content must be between 1 and 2000 characters long')
  ]
}

exports.deleteCommentRules = () => {
  return [
    body('commentId')
      .toInt()
      .isInt({ min: 1 }).withMessage('Comment id must be a positive integer')
  ]
}