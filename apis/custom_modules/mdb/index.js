/**
 * Created by SanJeev on 23-06-2017.
 */


const config =  require('../config');
var mdb = require('mongojs');
var objectId= require('mongojs').ObjectID;

db = {};
db.ObjectID=objectId;
db.mdb = mdb(config.mongodburl);
console.log("Connected MongoDB at ",config.mongodburl);

Object.freeze(db);
module.exports = db;