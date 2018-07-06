import nodemailer from 'nodemailer';
import config from "../config.json";

let mailer = (user, encryptedId, res) => {
    return new Promise((Resolve, Reject) => {
        let transporter = nodemailer.createTransport({
            host: config.emailHost,
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: config.email,
                pass: config.emailPassword
            }
        })
        let mailOptions = {
            from: config.noreplyFakeEmail,
            to: user.email,
            subject: 'Reset password link',
            html: `<p>Hi, ${user.username},<br>Click on below link to reset password<br><a href="${config.prod_ENV}/reset/${encryptedId}">click here</a></p>` // plain text body
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return Reject(error)
            }
            Resolve(info)
        });
    })
}

module.exports = {
    mailer
}