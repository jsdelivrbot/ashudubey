/**
 * Created by SanJeev on 22-06-2017.
 */

app = require('./custom_modules/imapp');
global.app=app;

require('./lib/api_common.js');
require('./lib/api_tickets.js');


app.get('', function(req, res){
    res.send('Everything is running good...');
});

var port =8094;
app.listen(port,function (err) {
    if(!err){
        Object.freeze(app);
        console.log('Listening on port...'+port);
    }
});
