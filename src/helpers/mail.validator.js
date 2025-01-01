// bun add nodemailer

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true, // Add debug logs
  logger: true, // Log the connection
});

const sendMail = async (email, subject, content) => {
  try {
    const mailOption = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: content,
    };

    // const info = await transporter.sendMail(mailOption, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //   }
    //   console.log(`Main has been send`, info.messageId);
    // });
    const info = await transporter.sendMail(mailOption);
    console.log(`Mail sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendMail };
