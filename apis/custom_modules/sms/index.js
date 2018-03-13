var Nexmo = require('nexmo');

var nexmo = new Nexmo({
    apiKey: '074a4112',
    apiSecret: 'bfb9dd14ac7e42c3'
});

obj = {};
obj.sendSMS = function (from,to,text,callback) {
    nexmo.message.sendSms(
        from,to,text,
        function (err, responseData) {
            if (err) {
                console.log("error>>>", err);
                callback(err)
            } else {
                console.log("success>>>", responseData);
                callback(responseData)
            }
        }
    );
};
module.exports = obj;