import nodemailer from 'nodemailer'

export async function sendEmail(to: string, subject: string, body: string) {
    let testAccount = await nodemailer.createTestAccount()
    console.log('testAccount: ', testAccount)

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'zn5j7kstxigi3eyx@ethereal.email',
            // user: testAccount.user,
            pass: 'cXUwAmaTUKPt7tCqRa',
            // pass: testAccount.pass,
        },
    })

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to,
        subject,
        html: body,
    })

    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
