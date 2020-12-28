const authService = require('../../services/auth');
const emailService = require('../../services/email');
const userService = require('../../services/user');
const { validationResult } = require('express-validator');

exports.view = async (req, res) => {
  const user = req.currentUser;
  const { id } = req.params;
  if (!id || Number(id) === user._id) {
    return res.status(200).send({
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      dateAdded: user.dateAdded
    });
  }
  const search = await userService.findUserById(id);
  if (!search) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.status(200).send({
    username: search.username,
    displayName: search.displayName,
    role: search.role,
    dateAdded: search.dateAdded
  });
}

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const user = req.currentUser;
  const { username, displayName, email, dateOfBirth, currentPassword, newPassword } = req.body;
  const requirePassword = user.username !== username || user.email !== email || newPassword;
  // Try to validate current password
  if (requirePassword) {
    try {
      await authService.authenticate(user.username, currentPassword);
    } catch (e) {
      return res.status(400).send({ error: 'Current password is incorrect' });
    }
  }
  user.username = username;
  user.displayName = displayName;
  user.dateOfBirth = dateOfBirth;
  // Users will have to confirm their new email
  if (user.email !== email) {
    user.email = email;
    user.role = 'new ' + user.role;
    user.activationCode = emailService.sendUpdateEmail(user);
  }
  if (newPassword) {
    user.password = authService.hashPassword(newPassword);
  }
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  const accessToken = authService.signAccessToken(user);
  const refreshToken = authService.signRefreshToken(user);
  res.status(200).send({ accessToken, refreshToken, message: 'Successfully updated' });
}