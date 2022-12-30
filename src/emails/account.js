const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRIG_API_KEY)

const sendWelcomeEmail = (email, name, password) => {
    sgMail.send({
        from: 'Task-Manager App <chaudharybalmukand@gmail.com>',
        to: email,
        subject: 'Thanks For joining our Task-manager App',
        text: `Welcome to the Task-manager App ${name}.Your password is ${password}. Let us know how you get along the app.`
    })
}
const sendCancelationEmail = (email, name) => {
    sgMail.send({
        from: 'Task-Manager App <chaudharybalmukand@gmail.com>',
        to: email,
        subject: 'Farewell My friend :-(',
        text: `We are sad to see you go ${name}. Let us know what we could have done to keep you onboard.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
