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

//Seprate Api for Getting Problem Type & User Type
app.get(path('get_problem_type/'), function (req, res) {

    db.mdb.collection('problem_type').find({}, function (err, result) {
        if (err) {
            app.sendError(req, res, err);
        }
        else {
            console.log(result[0]);
            app.send(req, res, result);
        }

    })

})

app.get(path('get_user_type/'), function (req, res) {

    db.mdb.collection('user_type').find({}, function (err, result1) {
        if (err) {
            app.sendError(req, res, err);
        } else {
            console.log(result1);
            app.send(req, res, result1);
        }

    })
})


var sendNotificationSMS = function (args, type, callback) {

    var TicketMsg = '';
    if (type === 'new') {
        TicketMsg = "Your Ticket No. is   " + args.ticket_number + "  Please remember this for further use";
    }
    else {
        TicketMsg = "The Status Of Your ticket no. " + args.ticket_number + " has been changed to " + args.status;
    }


    var url = 'http://shorteksms.shortekservices.com/pushsms.php?username=innosols&password=hitech8*&message=' + TicketMsg + '&sender=INOSLS&numbers=' + args.mobile;

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
                sendNotificationSMS(args, 'new', function (data) {
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


app.post(path('change_status/'), function (req, res) {
    var args = req.body;
    var query = {"_id": objectid(args._id)};
    db.mdb.collection('tickets').update(query,
        {$set: {'status':args.status}}, function (err, data) {
            if (!err) {
                var html = "The Status Of Your ticket no. " + args.ticket_number + " has been changed to " + args.status;
                mailer.send_mail('Status Of Your Ticket Number', html, args.email, CC_MAIL, function () {
                    sendNotificationSMS(args, 'update', function (data) {
                        app.send(req, res, data);
                    })
                });
            } else {
                app.sendError(req, res, 'Something Went Wrong', err);
            }


        });
});

app.put(path('update_problem_type/'), function (req, res) {
    var query = {"_id": objectid(req.query.id)};
    var name = req.query.name.toLowerCase();
    var name1 = name[0].toUpperCase() + name.substr(1, name.length)
    var id = name;
    db.mdb.collection('problem_type').update(query,
        {$set: {id: id, name: name1}}, function (err, data) {
            if (!err) {
                console.log(data);
                app.send(req, res, data);
            } else {
                app.sendError(req, res, 'Something Went Wrong', err);
            }


        });

});

app.put(path('update_user_type/'), function (req, res) {
    var query = {"_id": objectid(req.query.id)};
    var name = req.query.name.toLowerCase();
    var name1 = name[0].toUpperCase() + name.substr(1, name.length)
    var id = name;
    db.mdb.collection('user_type').update(query,
        {$set: {id: id, name: name1}}, function (err, result) {

            if (!err) {
                console.log(result);
                app.send(req, res, result);
            } else {
                app.sendError(req, res, 'Please try later', err)
            }

        });

})


app.post(path('add_new_user_type/'), function (req, res) {

    var name = req.query.name.toLowerCase();
    var name1 = name[0].toUpperCase() + name.substr(1, name.length)
    var obj = {id: name, name: name1};
    console.log(obj);

    db.mdb.collection('user_type').insert(obj, function (err, data) {
        if (!err) {
            app.send(req, res, data);
        } else {
            app.sendError(req, res, 'Something Went Wrong', err)
        }
    });


})










