var http = require('http')
  , fs = require('fs')
  , manifesto  = require('manifesto');

http.createServer(function (req, res) {

  if (req.url == '/manifest.appcache')
  {
    manifesto.fetch('./test-manifest.appcache', '.', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Something went wrong\n');
        return;
      }

      res.writeHead(200, {'Content-Type': 'text/cache-manifest'});
      res.end(data);
    });
  }
  else if (req.url == '/LICENSE')
  {
    fs.readFile('./LICENSE', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Something went wrong\n');
        return;
      }

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    });
  }
  else
  {
    fs.readFile('./test-index.html', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Something went wrong\n');
        return;
      }

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  }
}).listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');
