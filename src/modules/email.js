const mailgun = require("mailgun-js");

exports.sendEmail = (email, subject, template, options) => {
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
  mg.messages().send(data, function (error) {
    if (error) {
      console.log(error);
    }
  });
}