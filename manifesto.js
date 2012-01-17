/*
 * manifesto.js
 * (c) 2012 Alex Indigo <iam@alexindigo.com>
 */

var fs = require('fs')
  , cache = {};

// expose version from the package.json
//require('pkginfo')(module, 'version');

// fetch manifest data and start watching manifested files
exports.fetch = function(manifest, docroot, callback)
{
  var dir;

  // first timer? read the file
  if (!(manifest in cache))
  {
    cache[manifest] = {};

    // TODO: does it worth to make it async?
    parseManifest(manifest, docroot, function(err)
    {
      if (err)
      {
        // to prevent sudden continuation
        return callback(err);
      }

      callback(null, getManifest(manifest));
    });

    // done here
    return;
  }

  callback(null, getManifest(manifest));
};

// subroutines
function getManifest(manifest)
{
  return cache[manifest].manifest.replace('%%version%%', cache[manifest].version);
}

// strip cacheable items from the manifest file
function parseManifest(manifest, docroot, callback)
{
  var inCache = false
    , lines = [];

    // get manifest file data
    fs.readFile(manifest, 'ascii', function(err, data)
    {
      var counter = 0;

      if (err)
      {
        // to prevent sudden continuation
        return callback(err);
      }

      cache[manifest] =
      {
        version: 0,
        files: [],
        manifest: data
      };

      lines = data.split('\n');

      lines.forEach(function(line)
      {
        var match;

        line = line.trim();

        // empty lines
        if (line.substr(0, 1) == '') return;

        // skip comments
        if (line.substr(0, 1) == '#') return;

        // process control keywords
        switch (line)
        {
          case 'CACHE MANIFEST':
          case 'CACHE:':
            inCache = true;
            return;
            break;

          // TODO: Add proper support for fallbacks
          case 'NETWORK:':
          case 'FALLBACK:':
            inCache = false;
            return;
            break;
        }

        // do nothing for network files
        if (!inCache) return;

        // check the file and setup monitoring
        if (!line.match(/^http(s)?:\/\//))
        {
          addWatcher(docroot+line, watcher(manifest), function(added, mtime)
          {
            // undo counter
            counter--;

            if (!added)
            {
              // check if everything is done
              if (counter == 0) callback();
              return;
            }

            if (mtime > cache[manifest].version) cache[manifest].version = mtime;

            cache[manifest].files.push(line);

            // check if everything is done
            if (counter == 0) callback();
          });

          // track inception
          counter++;
        }

      });
    });
}

// gets file's mtime and sets the watcher
function addWatcher(file, handler, callback)
{
  fs.stat(file, function(err, stat)
  {
    if (err) return callback(false);

    fs.watch(file, handler(file));

    callback(true, stat.mtime.getTime());
  });
}

// generates version watcher callback
// going total inception
function watcher(manifest)
{
  return function(file)
  {
    return function(event)
    {
      if (event == 'change')
      {
        fs.stat(file, function(err, stat)
        {
          if (err) return; // do nothing at this point

          var mtime = stat.mtime.getTime();

          if (cache[manifest].version < mtime) cache[manifest].version = mtime;
        });
      }

      // TODO: add support for rename, maybe
    };
  }
}
