const nodemailer = require("nodemailer");
// const { SMTPClient } = require("emailjs");
const api_config = require("../config");
const { config } = require("dotenv");
const imageUrl = "https://kreedify.com/logo.png";
const appUrl = api_config.FRONTEND_URL || "https://localhost:5173";

const transporter = nodemailer.createTransport({
  host: api_config.SMTP_HOST,
  port: api_config.SMTP_PORT,
  secure: false,
  auth: {
    user: api_config.SMTP_EMAIL,
    pass: api_config.SMTP_PASSWORD
  }
});



const sendPasswordResetEmail = async (user) => {
  let messageBody = `<html> <head> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
   .header { text-align: center; padding: 20px; } .header img { max-width: 100px; } .content { padding: 20px; text-align: center; } .content h1 {  font-size: 24px; } .content p { color: #666666; font-size: 16px; } .button { display: inline-block; padding: 10px 20px; margin: 20px 0; color: #ffffff !important; background-color: #007BFF; text-decoration: none; border-radius: 5px; } 
   .footer { text-align: center; padding: 20px; color: #999999; font-size: 14px; } </style> </head> <body> <div class="header">  </div> <div class="container"> <div class="content"> 
   <h1>Reset Password</h1> <p>If you\'ve lost your password or wish to reset it, use the below link to get started</p> <a href="${appUrl}/reset-password/${user.verificationToken}" class="button">Reset Your Password</a> <p>If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password</p> </div> </div> </body> </html>`
  console.log(`${appUrl}/reset-password/${user.verificationToken}`)
  sendMail(user.email, "Reset your password for Friggle", messageBody);
}



const sendMail = async (to, subject, text) => {
  try {
    // console.log(`send mail to ${to} subject : ${subject} and message: ${text}`);
    const info = await transporter.sendMail({
      from: "support@friggle.com",
      to: to,
      subject: subject,
      html: text
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }

};


module.exports = {
  sendPasswordResetEmail,
  sendMail
};

