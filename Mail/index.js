const nodemailer = require('nodemailer');

let mailTransporter =
    nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'ankit01.monarch@gmail.com',
                pass: 'shze ehbr srqt mkzw'
            }
        }
    );

let mailDetails = {
    from: 'ankit01.monarch@gmail.com',
    to: 'ankitthakor61@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks',
    attachments: [{
        filename: "image.png",
        path: "./Upload/image/1715152847679Hetik -Birthday (2).png"
    }]
};

mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs===============>Mail Error');
            } else {
                console.log('Email sent successfully');
            }
        });