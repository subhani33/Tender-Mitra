const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {String} options.email - Recipient email address
 * @param {String} options.subject - Email subject
 * @param {String} options.message - Email body text
 * @param {String} options.html - Email HTML content (optional)
 * @returns {Promise} - Promise with sent message info
 */
const sendEmail = async(options) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2) Define email options
    const mailOptions = {
        from: `EdtoDo Technovations <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // 3) Send the email
    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;