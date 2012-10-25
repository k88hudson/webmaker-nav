#! /usr/local/bin/node

var express = require('express'),
    less = require('less'),
    fs = require('fs'),
    path = require('path'),
    app = express.createServer(express.logger()),
    port = 8020,
    dirname = __dirname;

function autoCompileLESS(dirname, pathnames) {
  return function(req, res, next) {
    if (pathnames.indexOf(req.url) != -1) {
      var lessPath = path.join(dirname, req.url.slice(1, -4) + '.less');
      var lessCode = fs.readFileSync(lessPath, 'utf-8');
      var parser = new less.Parser({
        paths: [path.dirname(lessPath)],
        filename: lessPath
      });
      return parser.parse(lessCode, function(err, tree) {
        if (err) {
          console.log(err);
          return res.send(500);
        }
        try {
          var css = tree.toCSS();
        } catch (e) {
          console.log(e);
          return res.send(500);
        }
        res.contentType('text/css');
        res.send(css);
      });
    }
    next();
  }
}
  
if (process.argv[2] && process.argv[2].match(/^[0-9]+$/))
  port = parseInt(process.argv[2]);

app.use(autoCompileLESS(dirname, ['/webmaker-nav/css/webmaker-nav.css']));
app.use(express.static(dirname));

app.listen(port, function() {
  console.log("serving on port " + port + " files in " + dirname);
});
