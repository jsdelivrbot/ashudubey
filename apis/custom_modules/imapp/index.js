/**
 * Created by SanJeev on 23-06-2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var db = require('../mdb');
var app = express();

// pass timestamp value in this function
dateFormat=function(_datetime){
    now_obj = {};
    _datetime = new Date(Date.parse(_datetime));
    var _date = new Date(_datetime.getFullYear(), _datetime.getMonth(), _datetime.getDate());
    _date.setTime( _date.getTime() - _date.getTimezoneOffset()*60*1000 ); // Ensure We GET DATE AS PER UTC TIME

    now_obj.datetime = _datetime.getTime();
    now_obj.date = _date.getTime();
    now_obj.datejs = _date;
    now_obj.datetimejs = _datetime;
    now_obj.month = _datetime.getMonth();
    now_obj.year = _datetime.getFullYear();
    now_obj.day = _datetime.getDate();
    return now_obj;
};

// CORS Policy
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Username, SourceKey");
    next();
});

app.use(bodyParser.json());

app.Response = function(){
    var self = {};
    self.status = '';
    self.isError = true;
    self.data = [];
    self.error = null;
    return self;
}

app.ErrorResponse = function(msg, stackTrace){
    var self = app.Response.call();
    self.status = 'err';
    self.msg = msg;
    self.isError = true;
    self.error = stackTrace;
    return self;
};

app.SuccessResponse = function(_data){
    var self = app.Response.call();
    self.data = _data;
    self.status = 'success';
    self.msg = 'success';
    self.isError = false;
    return self;
}

app.get('/test/', function (req, res) {
    res.send('Secret area');
});


app.use(function(req, res, next){
    console.log('----------- New Request --------------')
    console.log('---- Header ----')
    console.log('Method: ' + req.method);
    console.log('username: ' + req.get('Username'));
    req.username = req.get('Username');
    req.has_username = req.username != undefined;
    req.is_user_authorized = true; // Need to Manage Authorization

    console.log('url: ' + req.url);
    console.log('body: ' + JSON.stringify(req.body));
    console.log('query:' + JSON.stringify(req.query));
    console.log('params:' + JSON.stringify(req.params));
    console.log('--')
    next();
    console.log('--')
    console.log(' ');
})
app.send = function(req, res, data){
    res.send(new app.SuccessResponse(data));
};

app.sendError = function(req, res, msg, err){
    res.send(new app.ErrorResponse(msg, err));
}

module.exports = app;
