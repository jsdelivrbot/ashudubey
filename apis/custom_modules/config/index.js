/**
 * Created by SanJeev on 23-06-2017.
 */

var nodeMailer=require('nodemailer');
var swig=require('swig');

configs = {};
configs.mongodburl = "162.213.190.95:27180/v5_internals";

const options = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'infieldinfotech@gmail.com',
        pass: 'infield@123'
    }
};
const transporter = nodeMailer.createTransport(options);

configs.send_mail = function (subject,html,to_mail,cc_mail,callback){
    transporter.sendMail({
        from: "info@infield.tech",
        to: to_mail,
        cc:cc_mail,
        subject: subject,
        html:html
    }, function (error, response) {
        if (error) {
            callback('error');
        }
        else {
            callback('success');
        }
    });
};
module.exports = configs;
