const emailModule = require('../modules/email');
const { nanoid } = require('nanoid');

exports.sendConfirmEmail = async (user) => {
  const activationCode = nanoid();
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/verifyemail?code=${activationCode}`
  }
  await emailModule.sendEmail(user.email, "Confirm your email", "confirm_email", options)
  return activationCode;
}

exports.sendRecoveryEmail = async (user) => {
  const recoveryCode = nanoid();
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/recovery?code=${recoveryCode}`
  }
  await emailModule.sendEmail(user.email, "Reset your password", "password_recovery", options)
  return recoveryCode;
}

exports.sendUpdateEmail = async (user) => {
  const activationCode = nanoid();
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/verifyemail?code=${activationCode}`
  }
  await emailModule.sendEmail(user.email, "Update your email", "update_email", options)
  return activationCode;
}