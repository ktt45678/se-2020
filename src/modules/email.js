const mailgun = require("mailgun-js");

exports.sendEmail = async (email, subject, template, options) => {
  const mg = mailgun({
    apiKey: process.env.EMAIL_API,
    domain: process.env.EMAIL_DOMAIN
  });
  const data = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    template: template,
    'v:recipient_name': options.recipient_name,
    'v:button_url': options.button_url
  }
  await mg.messages().send(data);
}