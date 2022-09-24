import nodemailer from 'nodemailer'
import { title } from 'process';

async function sendEmail(email: string, subject: string, title: string, body: string, url: string, urlText: string)
{

    let transporter = nodemailer.createTransport( {
        host: "smtp-mail.outlook.com",
        port: 587,
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS, 
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Raafat 👻" <${process.env.MAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: `${url}`, // plain text body
        html: `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset your password</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                  <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                    <img width="200" src="https://pomf2.lain.la/f/83oropu4.png" title="logo" alt="logo">
                                  </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                ${title}</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                     ${body}
                                                </p>
                                                <a href="${url}"
                                                    style="background:#000;text-decoration:none !important; font-weight:500; margin-top:35px; color:#f0f02c;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                    ${urlText}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

}
// sendEmail(email:string, subject:string, title:string, body:string, url:string, urlText:string)
// (em, "Reset password", "You have requested to reset your password", "A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.", "https://rakeshmandal.com", "Reset Password")
export default sendEmail;