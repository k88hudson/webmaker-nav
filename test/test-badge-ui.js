"use strict";

defineTests([
  "jquery",
  "webmaker-nav/badge-ui"
], function($, BadgeUI) {
  module("badge-ui");
  
  test("inserts badge widget into ul.user-info", function() {
    var div = $('<div><ul class="user-info"></ul></div>');
    var ui = BadgeUI({container: div});
    equal(div.find('ul.user-info li.user-badges > .badge-ui-widget').length,
          1);
  });
});
