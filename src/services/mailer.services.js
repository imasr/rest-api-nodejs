import nodemailer from 'nodemailer';


let mailer = (user, encryptedId, res) => {
    return new Promise((Resolve, Reject) => {
        let transporter = nodemailer.createTransport({
            host: process.env.emailHost,
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.email,
                pass: process.env.emailPassword
            }
        })
        let mailOptions = {
            from: process.env.noreplyFakeEmail,
            to: user.email,
            subject: 'Reset password link',
            html: `<p>Hi ${user.username}!,
            <br>Click on below link to reset password
            <br><a href="${process.env.host}/reset/${encryptedId}">Click Here</a></p>` // plain text body
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