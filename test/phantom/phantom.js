var page = new WebPage();
page.onConsoleMessage = function(msg) {
  console.log(msg);
  if (msg.indexOf('END:') == 0) {
    var results = JSON.parse(msg.slice(4));
    var passed = results.total - results.failed;
    console.log(passed + " of " + results.total + " browser tests passed.");
    phantom.exit(results.failed);
  }
};

page.onInitialized = function() {
  page.evaluate(function() {
    window.inPhantomJS = true;
  });
};

var url = 'http://127.0.0.1:8051/test/';

console.log('opening ' + url);

page.open(url, function(status) {
  if (status != "success")
    return phantom.exit(1);
});
