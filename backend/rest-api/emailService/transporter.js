const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gheorghecostin221@gmail.com', // TODO: add them to env
        pass: 'mtgt eihs esiv cbkk',
    },
});

module.exports = {
    transporter
}