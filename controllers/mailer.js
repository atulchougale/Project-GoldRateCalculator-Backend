import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import dotenv from 'dotenv';
dotenv.config();

let nodeConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
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
    const emailBody = {
        body: {
            name: username,
            intro: text,
            outro: 'Need help or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    let mail = MailGenerator.generate(emailBody)
    // Define the email message
    const message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject,
        html: mail
    };

    try {
        // Send the email
        await transporter.sendMail(message);
        return res.status(200).send({ message: "You should receive an email from us." });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error });
    }
};
