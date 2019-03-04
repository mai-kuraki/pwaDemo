var express = require('express');
var ejs = require('ejs');
var request = require('request');
var https = require('https');
var http = require('http');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./private.key', 'utf8'),
  cert: fs.readFileSync('./full_chain.pem', 'utf8')
};

var app = express();
var httpsServer = https.createServer(options,app);
var httpServer = http.createServer(app);

app.engine('html', ejs.__express);
app.set('views engine', 'html');
app.use(express.static('public'));

app.get('/home', function(req, res) {
  return res.render('index.html');
});

app.get('/api/*', function (req, res) {
  let url = req.url;
  if(url.indexOf('/api') === 0) {
    if(url.indexOf('?') > -1) {
      url = url + '&key=32c01203ce89b21f9c6ca70556718ed6';
    }else {
      url = url + '?key=32c01203ce89b21f9c6ca70556718ed6';
    }
    url = url.replace('/api', 'http://v.juhe.cn');
    request({
      headers: {"Connection": "close"},
      url: url,
      method: 'GET',
      json: true,
    }, (error, response, data) => {
      res.json(data);
    });
  }
});

httpsServer.listen(9998);
httpServer.listen(9999);
console.log('listen https 9998, listen http 9999')