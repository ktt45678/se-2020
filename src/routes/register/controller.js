const User = require('../../models/user');

module.exports = (req, res) => {
  // Create user
  const user = new User({
    username: req.body.username,
    displayName: req.body.displayName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });
  // Error handler
  user.save().then((user) => {
    res.send(user);
  }, (err) => {
    res.status(400).send(err);
  });
};