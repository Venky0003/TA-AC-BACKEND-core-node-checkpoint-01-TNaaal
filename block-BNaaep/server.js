let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');
let userDir = path.join(__dirname, '/contact/');
let server = http.createServer(handleRequest);
function handleRequest(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  let parsedUrl = url.parse(req.url, true);
  let store = '';
  req.on('data', (chunk) => {
    store = store + chunk;
  });
  req.on('end', () => {
    if (req.method === 'GET' && req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      fs.readFile('./index.html', (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/about') {
      res.setHeader('Content-Type', 'text/html');
      fs.readFile('./about.html', (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'css') {
      res.setHeader('Content-Type', 'text/css');
      fs.readFile('.' + parsedUrl.pathname, (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'jpg') {
      if (res.setHeader('Content-Type', 'image/jpeg'));
      {
        fs.readFile('.' + parsedUrl.pathname, (err, content) => {
          if (err) return console.log(err);
          res.end(content);
        });
      }
    } else if (req.url === '/form' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      fs.readFile('./form.html', (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    } else if (req.url === '/form' && req.method === 'POST') {
      let username = JSON.parse(store).username;
      fs.open(userDir + username + '.json', 'wx', (err, fd) => {
        if (err) return console.log(err);
        console.log(fd);
        fs.writeFile(fd, store, (err) => {
          if (err) {
            return console.log(err);
          }
          fs.close(fd, () => {
            res.end(`${username} successfully created`);
          });
        });
      });
    } else {
      res.statusCode = 404;
      res.end('Page not found');
    }
  });
}

server.listen(5001, () => {
  console.log('Server Listening on Port 5001');
});
