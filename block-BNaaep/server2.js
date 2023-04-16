let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');
let qs = require('querystring');
let userDir = path.join(__dirname, '/contacts/');
console.log(userDir);


let server = http.createServer(handleRequest);
function handleRequest(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  let parsedUrl = url.parse(req.url, true);
  let store = '';
  req.on('data', (chunk) => {
    store = store + chunk;
  });
  req.on('end', () => {
    if (req.url === '/form' && req.method === 'GET') {
      res.setHeader('Content-Type', 'text/Html');
      fs.readFile('./form.html', (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    }
    if (req.url === '/form' && req.method === 'POST') {
      let data = qs.parse(store);
      let json = JSON.stringify(data);
      let username = data.username;
      fs.open(userDir + username + '.json', 'wx', (err, fd) => {
        if (err) {
          throw new Error('Username taken');
        }
        fs.writeFile(fd, json, (err) => {
          if (err) return console.error(err);
          res.setHeader('Content-Type', 'text/html');
          fs.close(fd, () => {
            res.end('Contacts saved');
          });
        });
      });
    }
    if (parsedUrl.pathname === '/contacts' && req.method === 'GET') {
      let username = parsedUrl.query.username;
      fs.readFile(userDir + username + '.json', (err, content) => {
        if (err) return console.log(err);
        console.log(content);
        let data = JSON.parse(content);
        res.setHeader('Content-Type', 'text/Html');
        res.write(`<h1>Name : ${data.name}</h1>`);
        res.write(`<p>Eamil :${data.email}</p>`);
        res.write(`<p>Username :${data.username}</p>`);
        res.write(`<p>Age: ${data.age}</p>`);
        res.write(`<p>Bio: ${data.bio}</p>`);
        res.end();
      });
    }
  });
}

server.listen(3000, () => {
  console.log('Server Listening on Port 3000');
});
