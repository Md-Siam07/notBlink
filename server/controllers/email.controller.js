const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');

const CLIENT_ID = '238579600997-53lavou1ru70a28sag4ggdvdm1ge6285.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04N9cQH1hY5PtCgYIARAAGAQSNwF-L9IrIXpOllpFupLqQSRgkUAy0IASR0dv1XCFgU__AzunsHOswNaSVaJH4gysgwtOHmsrNQo';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports.sendMail = (req, res, next) =>{
    to = req.body.recipiennt;
    examCode = req.body.examCode;
    // sendEmail( (doc, err) =>{
    //     if(!err) {res.send(doc);}
    //     else{
    //         console.log(`Error sending email`);
    //     }
    // }) 
    sendEmail(to, examCode).then( result => {
        console.log('Email sent...', result);
        res.send(result);
    })
    .catch(error => console.log(error.message));

}



async function sendEmail(receipient, examCode){

  try{
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        type: 'oAuth2',
        user: 'dynamicsiam01@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    }) 

    const mailOptions = {
      from: '!Blink <dynamicsiam01@gmail.com>',
      to: receipient,
      subject: "You have been invited!",
      text: 'Join with exam code: ' + examCode
    };

    const result = await transport.sendMail(mailOptions)
    return result

  }catch(err){
    console.log(err.message)
    return err
  }
}



//siam
