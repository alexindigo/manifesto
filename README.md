# manifesto, a node.js module

Automatically updates cache.manifest version number upon files modification.
Supports multiply manifest files.

## Example
When you call it first time it check mtime for each of listed files in your manifest file,
and starts to watch them. After that it serve your manifest file from memory, and adjusts
version number to the lastest mtime among listed files.

You can find browser-ready example in [test.js](https://github.com/alexindigo/manifesto/blob/master/test.js)

``` js
var http = require('http')
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
  else
  {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world!\n');
  }
}).listen(1337, "127.0.0.1");
```

If you make request to [manifest.appcache](https://github.com/alexindigo/manifesto/blob/master/test-manifest.appcache):

``` bash
$ curl http://localhost:1337/manifest.appcache
```

The output will be:

```
CACHE MANIFEST
#v1326771360000

CACHE:
...
```

## Installation

You should have `npm` installed already.

```
npm install manifesto
```

## TODO

* Add watcher for manifest file itself

## More Documentation

TBW

## Tests

TBW

## Credits

Author: [Alex Indigo](http://github.com/alexindigo/)

## License

[MIT](https://github.com/alexindigo/manifesto/blob/master/LICENSE)

[0]: http://github.com/alexindigo/manifesto
