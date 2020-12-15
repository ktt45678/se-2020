const emailModule = require('../modules/email');

exports.sendConfirmEmail = (user) => {
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/activate/${user.activationCode}`
  }
  emailModule.sendEmail(user.email, "Confirm your email", "confirm_email", options)
}

exports.sendRecoveryEmail = (user) => {
  const options = {
    recipient_name: user.displayName || user.username,
    button_url: `${process.env.WEBSITE_URL}/resetpassword/${user.recoveryCode}`
  }
  emailModule.sendEmail(user.email, "Reset your password", "password_recovery", options)
}