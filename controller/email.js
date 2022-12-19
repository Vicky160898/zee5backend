const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const config = require("../config/emailconfig");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(config.clientid, config.clientsecret);
OAuth2_client.setCredentials({ refresh_token: config.refreshtoken });

function send_mail( otp, recipient) {
  const accesstoken = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.user,
      clientId: config.clientid,
      clientSecret: config.clientsecret,
      refreshToken: config.refreshtoken,
      accessToken: accesstoken,
    },
  });

  const mail_options = {
    from: ` <${config.user}>`,
    to: recipient,
    subject: "Signup OTP",
    html: get_html_message(otp),
  };

  transport.sendMail(mail_options, function (error, result) {
    if (error) {
      console.log("errror", error);
    } else {
      console.log("success");
    }
    transport.close();
  });
}

function get_html_message(otp) {
  return `Hey Dear please use this otp for signup ${otp}`;
}

module.exports = send_mail;
