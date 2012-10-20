"use strict";

defineTests([
  "jquery",
  "webmaker-nav/badge-ui",
  "clopenbadger/clopenbadger",
  "clopenbadger/test/fake-clopenbadger-server"
], function($, BadgeUI, Clopenbadger, FakeServer) {
  var badger,
      wmnav;
  
  module("badge-ui", {
    setup: function() {
      wmnav = {
        container: $('<div><ul class="user-info"></ul></div>')
      };
      FakeServer.setup({
        urlPrefix: "http://fake-clopenbadger",
        availableBadges: {
          "FIRST_LOGIN": {
            "name": "First Login",
            "description": "Like a champion, you logged in...",
            "criteria": "Can log into a site that uses Persona for auth.",
            "image": "https://wiki.mozilla.org/images/b/bb/Merit-badge.png",
            "behaviors": [{"name": "LOGGED_IN", "score": 1}],
            "prerequisites": []
          },
          "FEEDBACK_MANIAC": {
            "name": "Feedback Maniac",
            "description": "You busted feedback.",
            "criteria": "Can submit feedback.",
            "image": "https://wiki.mozilla.org/images/b/bb/Merit-badge.png",
            "behaviors": [{"name": "GAVE_FEEDBACK", "score": 1}],
            "prerequisites": []
          },
          "BLARG": {
            "name": "Blarg",
            "description": "Blargy blarg.",
            "criteria": "Can blarg.",
            "image": "https://wiki.mozilla.org/images/b/bb/Merit-badge.png",
            "behaviors": [{"name": "BLARGED", "score": 1}],
            "prerequisites": []
          }
        }
      });
      badger = Clopenbadger({
        server: "http://fake-clopenbadger",
        token: "fake token",
        email: "foo@bar.org"
      });
    },
    teardown: function() {
    }
  });
  
  test("inserts badge list item into ul.user-info", function() {
    var div = $('<div><ul class="user-info"></ul></div>');
    var ui = BadgeUI(wmnav);
    equal($('ul.user-info li.user-badges', wmnav.container).length, 1);
  });
  
  test("unearned badges are listed alphabetically", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    var names = wmnav.container
      .find('.badge-ui-unearned-badges li .badge-ui-name')
      .map(function() { return $(this).text(); }).get();
    deepEqual(names, ['Blarg', 'Feedback Maniac', 'First Login']);
  });
  
  test("earned badges are listed reverse-chronologically", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.time = 1; badger.credit('LOGGED_IN');
    FakeServer.time = 2; badger.credit('BLARGED');
    FakeServer.time = 3; badger.credit('GAVE_FEEDBACK');
    FakeServer.flushResponses();
    var names = wmnav.container
      .find('.badge-ui-earned-badges li .badge-ui-name')
      .map(function() { return $(this).text(); }).get();
    deepEqual(names, ['Feedback Maniac', 'Blarg', 'First Login']);
  });
});
