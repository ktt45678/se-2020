const emailModule = require('../modules/email');
const { nanoid } = require('nanoid');

exports.sendConfirmEmail = (user) => {
  const activationCode = nanoid();
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/verifyemail?code=${activationCode}`
  }
  emailModule.sendEmail(user.email, "Confirm your email", "confirm_email", options)
  return activationCode;
}

exports.sendRecoveryEmail = (user) => {
  const recoveryCode = nanoid();
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/recovery?code=${recoveryCode}`
  }
  emailModule.sendEmail(user.email, "Reset your password", "password_recovery", options)
  return recoveryCode;
}

exports.sendUpdateEmail = (user) => {
  const activationCode = nanoid();
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/verifyemail?code=${activationCode}`
  }
  emailModule.sendEmail(user.email, "Update your email", "update_email", options)
  return activationCode;
}