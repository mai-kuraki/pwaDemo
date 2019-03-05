let express = require('express');
let ejs = require('ejs');
let request = require('request');
let https = require('https');
let http = require('http');
let fs = require('fs');

let options = {
  key: fs.readFileSync('./private.key', 'utf8'),
  cert: fs.readFileSync('./full_chain.pem', 'utf8')
};

let app = express();
let httpsServer = https.createServer(options,app);
let httpServer = http.createServer(app);

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
      url = url + '&key=5c177d0e6f5b351689bd1d811aa99e94';
    }else {
      url = url + '?key=5c177d0e6f5b351689bd1d811aa99e94';
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