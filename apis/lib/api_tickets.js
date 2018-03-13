/**
 * Created by Ashu on 3/6/2018.
 */


var mongojs = require('mongojs');
var mailer = require('../custom_modules/config');

var request = require('request');

var objectid = mongojs.ObjectId;

var path = function (path) {
    return '/api/tickets/' + path;
};

var CC_MAIL = ['unmukt@v5global.com'];

//Single Api for getting dropdown data in userType & Problem Type

app.get(path('getting_dropdown_data/'), function (req, res) {

    db.mdb.collection('user_type').find({}, function (err, data1) {
        if (err) {
            app.sendError(req, res, err);
        }
        else {
            db.mdb.collection('problem_type').find({}, function (err, data2) {
                if (!err) {
                    app.send(req, res, [data1, data2]);
                }

                else {
                    app.send(req, res, err);
                }
            })

        }
    })
})


var sendNotificationSMS = function (args, callback) {

    var msg = "Your Ticket No. is   " + args.ticket_number + "  Please remember this for further use";

    var url = 'http://shorteksms.shortekservices.com/pushsms.php?username=innosols&password=hitech8*&message=' + msg + '&sender=INOSLS&numbers=' + args.mobile;

    request({
        uri: url,
        method: "GET"
    }, function (error, response, body) {
        if (!error) {
            callback(args);
        }
        else {
            callback(args);
        }
    })
};

// function & Api for submiiting data
var function_for_add_forms_data = function (req, res) {
    if (req.method == 'POST') {
        var args = req.body;
    }
    else {
        var args = req.query;
    }

    if (args.mobile != undefined) {
        args.mobile = args.mobile.toString();
    }
    args['date'] = new Date().getTime();
    var rd = new Date().getTime().toString();
    args['ticket_number'] = 'TKT' + rd.substr(7);
    args['status'] = 'pending';
    db.mdb.collection('tickets').insert(args, function (err, data) {
        if (!err) {
            var html = "Your Ticket No. is   " + args.ticket_number + "  Please remember this for further use";
            mailer.send_mail('Raised Ticket Number', html, args.email, CC_MAIL, function () {
                sendNotificationSMS(args, function (data) {
                    app.send(req, res, data);
                })
            });
        }
        else {
            app.sendError(req, res, err)
        }
    })
};

app.post(path('add_new_forms_data/'), function_for_add_forms_data);


var view_report_data = function (req, res) {
    var query = {'ticket_number': req.query.key};
    db.mdb.collection('tickets').find(query, function (err, data) {
        if (!err) {
            app.send(req, res, data);
        }
        else {
            app.send(req, res, err);
        }
    })

};

app.get(path('get_report_data/'), view_report_data);


app.get(path('get_raised_ticket_report/'), function (req, res) {

    var args = req.query;
    var sdate = new Date(args.sdate).setHours(0, 0, 0, 0);
    var edate = new Date(args.edate).setHours(23, 0, 0, 0);
    var query = {'date': {$gte: sdate, $lte: edate}};

    db.mdb.collection('tickets').find(query, function (err, data) {
        if (!err) {
            app.send(req, res, data);
        }
        else {
            app.send(req, res, err);
        }
    })
});


app.put(path('change_status/'), function (req, res) {
    var query = {"_id":objectid(req.query.id)};
    db.mdb.collection('tickets').update(query,
        {$set: {'status':req.query.status }}, function (err, data) {
            if (!err) {
                console.log(data);
                app.send(req,res,data);
            }else{
                app.sendError(req,res,'Something Went Wrong',err);
            }


        });
});









