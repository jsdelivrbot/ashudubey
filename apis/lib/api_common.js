/**
 * Created by a1san on 27-06-17.
 */

var crypto = require('../custom_modules/encryption');
var mailer = require('../custom_modules/config');

var api_path = function (path) {
    return '/api/common/' + path;
};


var function_for_add_forms_data = function (req, res) {
    if (req.method == 'POST') {
        var args = req.body;
    }
    else {
        var args = req.query;
    }
    var coll_name = req.params.name;

    if (args.Mobile != undefined) {
        args.Mobile = args.Mobile.toString();
    }
    if (args.AadharNumber != undefined) {
        args.AadharNumber = args.AadharNumber.toString();
    }
    if (args.visitor_card_no != undefined) {
        args.visitor_card_no = args.visitor_card_no.toString();
    }
    if (args.Age != undefined) {
        args.Age = args.Age.toString();
    }
    if (args.Experience != undefined) {
        args.Experience = args.Experience.toString();
    }
    if (args.LastSalary != undefined) {
        args.LastSalary = args.LastSalary.toString();
    }
    if (args.type === 'interview') {
        args['InterviewedBy'] = 'N/A';
        args['ShortlistedFor'] = 'N/A';
        args['PositionClosedBy'] = 'N/A';
    }
    if (args.type === 'pf') {
        args['ActionTaken'] = 'N/A';
    }
    if (args.type === 'esic') {
        args['ActionTaken'] = 'N/A';
    }
    if (args.type === 'f&f') {
        args['ActionByPM_PE'] = 'N/A';
        args['ActionByHR'] = 'N/A';
        args['ActionByFinance'] = 'N/A';
    }

    var date = new Date();
    var timestamp = date.getTime();
    args['Created_at'] = date;
    args['timestamp'] = timestamp;

    var init_date = date.setHours(6, 0, 0, 0);

    //if(args.type!='f&f'){
    //    db.mdb.collection(coll_name).find({
    //        "Mobile": {$exists: true},
    //        "Mobile": args.Mobile,
    //        "timestamp": {$gte: init_date}
    //    }, function (err, data) {
    //        if (!err) {
    //            if (data.length > 0) {
    //                app.sendError(req, res,'Form already submitted today by this mobile number!')
    //            }
    //            else {
    //                db.mdb.collection(coll_name).insert(args, function (err, data) {
    //                    if (!err) {
    //                        app.send(req, res,'Form data have been submitted successfully!');
    //                    }
    //                    else {
    //                        app.sendError(req, res, err)
    //                    }
    //                })
    //            }
    //        }
    //        else {
    //            app.sendError(req, res, err)
    //        }
    //    })
    //}
    //else {

    db.mdb.collection(coll_name).insert(args, function (err, data) {
        if (!err) {
            app.send(req, res, 'Form data have been submitted successfully!');
        }
        else {
            app.sendError(req, res, err)
        }
    })
};
app.get(api_path('add_new_forms_data/:name'), function_for_add_forms_data);
app.post(api_path('add_new_forms_data/:name'), function_for_add_forms_data);

var function_for_user_login = function (req, res) {
    if (req.method == 'POST') {
        var args = req.body;
    }
    else {
        var args = req.query;
    }
    if (args.username != undefined && args.username != null && args.username != '' && args.password != undefined && args.password != null && args.password != '') {
        db.mdb.collection('employees').findOne({loginid: args.username}, function (err, data) {
            if (!err) {
                if (data != null && data != 'null') {
                    if (crypto.matchpwd(args.password, data.password)) {
                        json = {
                            name: data.name,
                            user_type: data.user_type,
                            loginid: data.loginid,
                            isResetPwd: data.isResetPwd
                        };
                        app.send(req, res, json);
                    }
                    else {
                        app.sendError(req, res, 'Remind your Password!')
                    }
                } else {
                    app.sendError(req, res, 'Hey ! You are not permitted to login.')
                }
            }
            else {
                app.sendError(req, res, err)
            }
        })
    }
    else {
        app.sendError(req, res, 'Are you crazy? Fill the details!')
    }
};
app.get(api_path('login/'), function_for_user_login);
app.post(api_path('login/'), function_for_user_login);

var generate_random_password = function (userData, callback) {
    var randomPwd = Math.random().toString(36).slice(-6);
    var email_html = 'Hello' + " " + userData.name + ' ' + 'Your temporary password for login into T.M.S is <b>' + randomPwd + '</b>';
    mailer.send_mail('Reset Password', email_html, userData.email, function (resp) {
        if (resp != 'error') {
            db.mdb.collection('employees').update({loginid: userData.loginid},
                {$set: {password: crypto.encryptpwd(randomPwd), isResetPwd: false}}, function (err, data) {
                    if (!err) {
                        data.email = userData.email;
                        callback(data)
                    }
                    else {
                        callback('error')
                    }
                });
        }
        else {
            callback('error')
        }
    });
};
var function_for_forget_pwd = function (req, res) {
    if (req.method == 'POST') {
        var args = req.body;
    }
    else {
        var args = req.query;
    }
    if (args.username != undefined && args.username != null && args.username != 'null' && args.username != '') {
        db.mdb.collection('employees').findOne({loginid: args.username}, function (err, data) {
            if (data != null && data.loginid != undefined && data.loginid != null && data.loginid != '') {
                generate_random_password(data, function (resp) {
                    if (resp != 'error') {
                        app.send(req, res, resp);
                    }
                    else {
                        app.sendError(req, res, 'Oops! Internal server error.');
                    }
                })
            }
            else {
                app.sendError(req, res, 'Hey! Username not found.');
            }
        })
    }
    else {
        app.sendError(req, res, 'Oops! Please enter username.');
    }

};
app.get(api_path('forget_password/'), function_for_forget_pwd);
app.post(api_path('forget_password/'), function_for_forget_pwd);

var function_for_reset_pwd = function (req, res) {
    if (req.method == 'POST') {
        var args = req.body;
    }
    else {
        var args = req.query;
    }
    console.log(args);
    if (args.username != undefined && args.username != null && args.username != '' &&
        args.pwd1 != undefined && args.pwd1 != null && args.pwd1 != '' &&
        args.pwd2 != undefined && args.pwd2 != null && args.pwd2 != '') {
        if (args.pwd1 == args.pwd2) {
            db.mdb.collection('employees').update({loginid: args.username},
                {$set: {password: crypto.encryptpwd(args.pwd1), isResetPwd: true}}, function (err, data) {
                    if (!err) {
                        app.send(req, res, data);
                    }
                    else {
                        app.sendError(req, res, err)
                    }
                })
        }
        else {
            app.sendError(req, res, 'Oops! Password does not match!')
        }
    }
    else {
        app.sendError(req, res, 'Hey! Fill the details!')
    }
};
app.get(api_path('reset_password/'), function_for_reset_pwd);
app.post(api_path('reset_password/'), function_for_reset_pwd);

var function_for_get_all_users = function (req, res) {
    if (req.method == 'POST') {
        var args = req.body;
    }
    else {
        var args = req.query;
    }
    if (args != undefined && args != null && args.user_type != undefined && args.user_type != null && args.user_type != "") {
        if (args.user_type == 'admin') {
            db.employees.find({user_type: {$ne: 'admin'}}, function (err, data) {
                if (!err) {
                    app.send(req, res, data);
                }
                else {
                    app.sendError(req, res, err)
                }
            })
        }
        else if (args.user_type == 'pc') {
            db.users.find({user_type: "developer"}, function (err, data) {
                if (!err) {
                    app.send(req, res, data);
                }
                else {
                    app.sendError(req, res, err)
                }
            })
        }
        else {
            app.sendError(req, res, 'Oops! User type found to be unsatisfactory!')
        }
    }
    else {
        app.sendError(req, res, 'Oops! Please specify user type!')
    }
};
app.get(api_path('get_all_users/'), function_for_get_all_users);
app.post(api_path('get_all_users/'), function_for_get_all_users);
