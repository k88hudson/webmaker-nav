var express = require('express'),
    path = require('path'),
    spawn = require('child_process').spawn,
    app = express.createServer(),
    port = 8051,
    dirname = path.normalize(__dirname + '/../..');

app.use(express.static(dirname));

app.listen(port, function() {
  console.log("serving on port " + port + " files in " + dirname);
  var phantom = spawn('phantomjs', [__dirname + '/phantom.js']);
  phantom.stdout.setEncoding('utf8');
  phantom.stderr.setEncoding('utf8');
  phantom.stdout.on('data', function(chunk) { console.log(chunk); });
  phantom.stderr.on('data', function(chunk) { console.log(chunk); });
  phantom.on('exit', function(status) {
    console.log('phantomjs exited with code', status);
    process.exit(status);
  });
});
