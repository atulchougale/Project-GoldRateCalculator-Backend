import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import dotenv from 'dotenv';
dotenv.config();

let nodeConfig ={
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})


/** POST: http://localhost:8080/users/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {
    // Extract data from the request body
    const username = req.body.username;
    const userEmail = req.body.userEmail;
    const text = req.body.text || "Welcome to AC Gold Rate! We will be more than happy to tell you today's GOLD PRICE.";
    const subject = req.body.subject || "Signup Successful";

    // Define the email body
    const emailBody = `
        <p>Hi ${username},</p>
        <p>${text}</p>
        <p>Need help or have questions? Just reply to this email, we'd love to help.</p>
    `;

    // Define the email message
    const message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject,
        html: emailBody
    };

    try {
        // Send the email
        await transporter.sendMail(message);
        return res.status(200).send({ msg: "You should receive an email from us." });
    } catch (error) {
        return res.status(500).send({ error });
    }
};
