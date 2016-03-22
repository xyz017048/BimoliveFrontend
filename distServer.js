const express = require('express'),
      app     = express();

var port = process.env.PORT || 8080; 

app.set('views', __dirname + '/dist');
app.set('view engine', 'jade');

app.use(express.static('/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/scripts',  express.static(__dirname + '/dist/scripts'));
app.use('/styles',  express.static(__dirname + '/dist/styles'));
app.use('/views',  express.static(__dirname + '/dist/views'));
app.use('/images',  express.static(__dirname + '/dist/images'));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port);

console.log('Server is running on port ' + port);
