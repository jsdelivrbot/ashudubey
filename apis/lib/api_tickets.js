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

    db.mdb.collection('project_type').find({}, function (err, data1) {
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

app.get(path('get_project_type/'), function (req, res) {

    db.mdb.collection('project_type').find({}, function (err, result1) {
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
    if (type.toLowerCase() === 'new') {
        TicketMsg = "Thank you for raising request.Your request has been assigned ticket number " + args.ticket_number + " ,and is very important to us.We will process your ticket as quickly as possible. ";
    }
    else
        TicketMsg = args.msg;

    var url = 'http://shorteksms.shortekservices.com/pushsms.php?username=v5global&password=v5global&message=' + TicketMsg + '&sender=V5GLBL&numbers=' + args.mobile;

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
    args['status'] = 'Pending';
    args['priority'] = 'Not Assigned';
    db.mdb.collection('tickets').insert(args, function (err, data) {
        if (!err) {
            var html = "Thank you for raising request.Your request has been assigned ticket number " + args.ticket_number + " ,and is very important to us.We will process your ticket as quickly as possible. ";
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
    var tkt = req.query.key
    var status = false

     if(tkt.length>6){
        if(tkt.substr(0,3).toLowerCase()!='tkt'){
            app.sendError(req, res, "Please Enter A Valid Ticket No",{});
        }
        else {
            tkt = 'TKT' + tkt.substr(3)
            status = true
        }
    }
    else if(tkt.length==6){
        tkt = 'TKT' + tkt
        status = true
    }
    else {
        app.sendError(req, res, "Please Enter A Valid Ticket No",{});
    }
    if(status){
        var query = {'ticket_number': tkt};
        db.mdb.collection('tickets').find(query, function (err, data) {
            if (!err) {
                app.send(req, res, data);
            }
            else {
                app.sendError(req, res, "Please Enter A Valid Ticket No",err);
            }
        })
    }


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
    var type = args.status;
    console.log(type)
    var TicketMsg = '';
    if (type.toLowerCase() === 'new') {
        TicketMsg = "Thank you for raising request.Your request has been assigned ticket number " + args.ticket_number + " ,and is very important to us.We will process your ticket as quickly as possible. ";
    }
    else if(type.toLowerCase()==='inprocess'){

        TicketMsg = "Your Ticket is in InProcess and you will get response as soon as possible"

    }
    else if(type.toLowerCase()==='not approved'){

        TicketMsg = "Your" + args.ticket_number +" has been closed because we have not get an approval from management .Thank you for your time and patience; we hope our services matched your expectations."

    }
    else {
        TicketMsg = "Your " + args.ticket_number + "  has been resolved successfully,We have completed work on your request. Thank you for your time and patience.We hope our services matched your expectations." +" "+
            "Regards- V5 IT HELPDESK"
    }
    console.log(TicketMsg)
    args.msg = TicketMsg
    db.mdb.collection('tickets').update(query,
        {$set: {'status': args.status}}, function (err, data) {
            if (!err) {

                mailer.send_mail('Status Of Your Ticket',TicketMsg, args.email, CC_MAIL, function () {
                    sendNotificationSMS(args, args.status, function (data) {
                        app.send(req, res, data);
                    })
                });
            } else {
                app.sendError(req, res, 'Something Went Wrong', err);
            }


        });
});


app.post(path('change_priority_type/'), function (req, res) {
    var args = req.body;
    var query = {"_id": objectid(args._id)};
    db.mdb.collection('tickets').update(query,
        {$set: {'priority': args.priority}}, function (err, data) {
            if (!err) {
                app.send(req, res, data);
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

app.post(path('delete_problem_type/'), function (req, res) {
    var query = {
        "id" : req.query.id
    };
    console.log('hiii',query);
    db.mdb.collection('problem_type').remove(query,function (err, data) {
            if (err) {
                app.sendError(req, res, 'Error in deletion');
            }
            else {
                console.log(data)
                app.send(req, res, data);
            }
        })

});


app.post(path('delete_project_type/'), function (req, res) {
    var query = {
        "id" : req.query.id
    };
    console.log('hiii',query);
    db.mdb.collection('project_type').remove(query,function (err, data) {
        if (err) {
            app.sendError(req, res, 'Error in deletion');
        }
        else {
            console.log(data)
            app.send(req, res, data);
        }
    })

});


app.put(path('update_project_type/'), function (req, res) {
    var query = {"_id": objectid(req.query.id)};
    var name = req.query.name.toLowerCase();
    var name1 = req.query.name
    var id = name;
    db.mdb.collection('project_type').update(query,
        {$set: {id: id, name: name1}}, function (err, result) {

            if (!err) {
                console.log(result);
                app.send(req, res, result);
            } else {
                app.sendError(req, res, 'Please try later', err)
            }

        });

})


app.post(path('add_new_project_type/'), function (req, res) {

    var name = req.query.name.toLowerCase();
    var name1 = req.query.name
    var obj = {id: name, name: name1};
    console.log(obj);

    db.mdb.collection('project_type').insert(obj, function (err, data) {
        if (!err) {
            app.send(req, res, data);
        } else {
            app.sendError(req, res, 'Something Went Wrong', err)
        }
    });


})

app.post(path('add_new_problem_type/'), function (req, res) {

    var name = req.query.name.toLowerCase();
    var name1 = name[0].toUpperCase() + name.substr(1, name.length)
    var obj = {id: name, name: name1};

    console.log(obj);

    db.mdb.collection('problem_type').insert(obj, function (err, result) {
        if (!err) {
            app.send(req, res, result);
        } else {
            app.sendError(req, res, 'Please Try Again', err)
        }
    });
})


// function & Api for submiiting new requirement form data

var new_requirement_form_data = function (req, res) {

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

    db.mdb.collection('new_requirement').insert(args, function (err, data) {
        if (!err) {
            console.log('hiii');
            app.send(req, res, data);
        }
        else {
            app.sendError(req, res, err)
        }
    })
};

app.post(path('submit_new_requirement_data/'), new_requirement_form_data);


app.get(path('get_new_requirement_report/'), function (req, res) {

    var args = req.query;

    var sdate = new Date(args.sdate).setHours(0, 0, 0, 0);
    var edate = new Date(args.edate).setHours(23, 0, 0, 0);
    var query = {'date': {$gte: sdate, $lte: edate}};

    db.mdb.collection('new_requirement').find(query, function (err, data) {
        if (!err) {

            for (var i = 0; i < data.length; i++) {
                var temp = ''
                data[i].requirement.forEach(function (item) {
                    console.log(item)
                    temp += item + " "
                })
                data[i].requirement = temp
            }

            app.send(req, res, data);
        }
        else {
            app.send(req, res, err);
        }
    })
});














