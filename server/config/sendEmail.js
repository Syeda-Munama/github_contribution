const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "millie.designs66@gmail.com",
        pass: "twnlkbxwxcdmngse",
      },
    });

    const info = await transporter.sendMail({
      from: '"GitHub Reminder" <millie.designs66@gmail.com>',
      to,
      subject,
      text,
    });

    console.log(`Email sent successfully: ${info.messageId}`);
    return `Email sent successfully: ${info.messageId}`;
  } catch (error) {
    console.error("Error while sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;

// Example Usage:
// sendEmail("syedamunamahassan@gmail.com", "test github reminder", "testing")
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error.message));
