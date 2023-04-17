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
      res.setHeader('Content-Type', 'text/Html');
      fs.readFile('./form.html', (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    } else if (req.url === '/form' && req.method === 'POST') {
      let data = qs.parse(store);
      let dataStr = JSON.stringify(data);
      let username = data.username;
      if (!username) {
        res.end(`Please enter a valid username`);
      } else {
        fs.open(userDir + username + '.json', 'wx', (err, fd) => {
          if (err) {
            return res.end('Username taken');
          } else {
            fs.writeFile(fd, dataStr, (err) => {
              if (err) return console.error(err);
              res.setHeader('Content-Type', 'text/html');
              fs.close(fd, () => {
                res.end('Contacts saved');
              });
            });
          }
        });
      }
    } else if (parsedUrl.pathname === '/users' && req.method === 'GET') {
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
    } else if (parsedUrl.pathname === '/users' && req.method === 'GET') {
      fs.readdir(userDir, (err, content) => {
        if (err) {
          return console.log(err);
        } else {
          // console.log(content);
          let renderedFiles = 0;
          content.forEach((list, index) => {
            let filePath = path.join(userDir, list);
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                return console.log(err);
              }
              let user = JSON.parse(data);
              res.write(`<h1>Name : ${user.name}</h1>`);
              res.write(`<p>Eamil :${user.email}</p>`);
              res.write(`<p>Username :${user.username}</p>`);
              res.write(`<p>Age: ${user.age}</p>`);
              res.write(`<p>Bio: ${user.bio}</p>`);

              renderedFiles++;
              if (renderedFiles === content.length) {
                // res.write('</body></html>');
                res.end();
              }
            });
            // if (index === content.length - 1) {
            //   // res.write('</body></html>');
            //   res.end();
            // }
          });
        }
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
