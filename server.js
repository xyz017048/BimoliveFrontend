const express = require('express'),
      app     = express();

var port = process.env.PORT || 8080; 

app.set('views', __dirname + '/app');
app.set('view engine', 'jade');

app.use(express.static('/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/scripts',  express.static(__dirname + '/app/scripts'));
app.use('/styles',  express.static(__dirname + '/app/styles'));
app.use('/views',  express.static(__dirname + '/app/views'));
app.use('/images',  express.static(__dirname + '/app/images'));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port);

console.log('Server is running on port ' + port);
