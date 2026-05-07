// const nodemailer = require("nodemailer");
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465, //587
//   secure: true, //false
//   auth: {
//     user: process.env.SMTP_USERNAME,
//     pass: process.env.SMTP_PASSWORD
//   }
// });

// const emailWithNodemailer = async (emailData) => {
//   // try {
//   //   const mailOptions = {
//   //     from: process.env.SMTP_USERNAME, // sender address
//   //     to: emailData.email, // list of receivers
//   //     subject: emailData.subject, // Subject line
//   //     html: emailData.html, // html body
//   //   }
//   //   const info = await transporter.sendMail(mailOptions);
//   //   console.log("Email sent %s", info.response);
//   // } catch (error) {
//   //   console.error('Error sending mail', error);
//   //   throw error;
//   // }


//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure:false,
//     auth: {
//       // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//       user: 'mdmahin1310@gmail.com',
//       pass: 'cgdu cgaw sgtc wevx',
//       // user: 'raseldev847@gmail.com',
//       // pass: "fqtj ielp fdko grmg"
//     },
//   });
  

//   try {
//     console.log('mail send started');
//     await transporter.sendMail({
//       from: 'mdmahin1310@gmail.com', // sender address
//       to: emailData.email, // list of receivers
//       subject: emailData.subject,
//       text:  '', // plain text body
//       html: emailData.html, // html body
//     });
//     console.log("successfully sented...")
//     return res.status(200).json({ message: 'Email sent successfully' });;
//   } catch (error) {
//     console.log('send mail error:', error);
//     return res.status(500).json({ message: 'Failed to send email', error: error.message });
//   }



// };

// module.exports = emailWithNodemailer;


// const nodemailer = require("nodemailer");

// const emailWithNodemailer = async (emailData) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
    // auth: {
    //   user: 'raseldevsta@gmail.com',
    //   pass: 'xtqk ierl blgp nbzq', // app password
    // },
//   });

//   try {
//     console.log('Mail send started...');
//     await transporter.sendMail({
//       from: 'raseldevsta@gmail.com',
//       to: emailData.email,
//       subject: emailData.subject,
//       text: '', // optional
//       html: emailData.html,
//     });
//     console.log("Successfully sent!");
//     return { success: true, message: 'Email sent successfully' };
//   } catch (error) {
//     console.error('Send mail error:', error);
//     return { success: false, message: 'Failed to send email', error: error.message };
//   }
// };

// module.exports = emailWithNodemailer;



const nodemailer = require("nodemailer");

const isProduction = process.env.NODE_ENV === 'production';

// console.log(" isProduction:", isProduction);
// console.log(" config.smtp.host:", config.smtp.host);
// console.log(" config.smtp.user:", config.smtp.user);
// console.log(" config.smtp.pass:", config.smtp.pass);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // sending SMTP server
  port: isProduction ? 465 : 587,             // SSL port
  secure: isProduction,           // true for port 465
    auth: {
      user: 'raseldevsta@gmail.com',
      pass: 'xtqk ierl blgp nbzq', // app password
    },
  tls: { rejectUnauthorized: false },
});


transporter.verify((err, success) => {
  if (err) {
    console.error('SMTP connection failed', err);
  } else {
    console.log('SMTP is ready to send mail');
  }
});  


const emailWithNodemailer = async (emailData) => {



    try {
     console.log('mail send started......');
    await transporter.sendMail({
      from: 'raseldevsta@gmail.com', // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject,
      html: emailData.html, // html body
    });

    console.log('mail sended successfully.....');
    
  } catch (error) {
    console.log('send mail error:', error);
    
  }
  console.log('mail sended stopped');

};

module.exports = emailWithNodemailer;
