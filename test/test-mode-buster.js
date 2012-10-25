"use strict";

defineTests([
  "jquery",
  "webmaker-nav/mode-buster"
], function($, ModeBuster) {
  var div, canceled, mb;

  function makeMousedownEvent() {
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("mousedown", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);
    return event;
  }
  
  module("mode-buster", {
    setup: function() {
      div = $('<div><div class="inside"></div></div>')
        .appendTo(document.body);
      canceled = 0;
      mb = ModeBuster({
        container: div,
        oncancel: function() {
          canceled++;
        }
      });
    },
    teardown: function() {
      mb.disable();
      div.remove();
    }
  });

  test("events in container don't trigger oncancel", function() {
    mb.enable();
    div[0].dispatchEvent(makeMousedownEvent());
    equal(canceled, 0);
  });
  
  test("events on container don't trigger oncancel", function() {
    mb.enable();
    $('.inside', div)[0].dispatchEvent(makeMousedownEvent());
    equal(canceled, 0);
  });
  
  test("oncancel called when ModeBuster enabled", function() {
    mb.enable();
    document.body.dispatchEvent(makeMousedownEvent());
    equal(canceled, 1);
  });

  test("oncancel not called when ModeBuster disabled", function() {
    document.body.dispatchEvent(makeMousedownEvent());
    equal(canceled, 0, "disabled by default");
    
    mb.enable();
    mb.disable();

    document.body.dispatchEvent(makeMousedownEvent());
    equal(canceled, 0);
  });
  
  test("ModeBuster disables itself after first oncancel", function() {
    mb.enable();
    document.body.dispatchEvent(makeMousedownEvent());
    document.body.dispatchEvent(makeMousedownEvent());
    equal(canceled, 1);
  });
});
