/**
 * Created by SanJeev on 21-06-2017.
 */

var gulp = require('gulp');
var webserver=require('gulp-webserver');
var nodemon=require('gulp-nodemon');

var _index='./panel/';
var options = {
    host: 'localhost',
    port:9000,
    livereload:true,
    directoryListening:true,
    open:true
};

gulp.task('node',function(){
nodemon({
    script:'./apis/server.js',
    env:{'NODE_ENV':'devlopment'}
})
});

gulp.task('open',function () {
    gulp.src(_index)
        .pipe(webserver(options));
});

gulp.task('default', ['node','open'], function() {
});


