import nodemailer from 'nodemailer';
import  config from "../config.json";


let mailer=(email,encryptedId, res)=>{
    return new Promise ((Resolve,Reject)=>{
        let transporter=nodemailer.createTransport({
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
            from: config.noreplyFakeEmail, // sender address
            to: email, // list of receivers
            subject: 'Reset password link', // Subject line
            html: `<p>Click on below link to reset password<br><br><a href="${config.host_url}/reset/${encryptedId}">click here</a></p>`// plain text body
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