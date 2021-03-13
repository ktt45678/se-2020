module.exports = (expiry = 120, limit = 1, errorMode = false) => {
  return (req, res, next) => {
    next();
  }
}