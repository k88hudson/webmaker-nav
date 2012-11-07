"use strict";

defineTests([
  "jquery",
  "webmaker-nav/badge-ui",
  "clopenbadger/clopenbadger",
  "clopenbadger/test/fake-clopenbadger-server"
], function($, BadgeUI, Clopenbadger, FakeServer) {
  var badger,
      wmnav,
      div;

  module("badge-ui", {
    setup: function() {
      div = $('<div><ul class="user-info"></ul></div>')
        .appendTo(document.body);
      wmnav = {container: div};
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
      div.remove();
    }
  });
  
  test("inserts badge list item into ul.user-info", function() {
    var ui = BadgeUI(wmnav);
    equal($('ul.user-info li.user-badges', div).length, 1);
  });
  
  test("unearned badges are listed alphabetically", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    var names = div.find('.badge-ui-unearned-badges li .badge-ui-name')
      .map(function() { return $(this).text(); }).get();
    deepEqual(names, ['Blarg', 'Feedback Maniac', 'First Login']);
  });
  
  test("earned badges are listed reverse-chronologically", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    FakeServer.time = 1; badger.credit('LOGGED_IN');
    FakeServer.time = 2; badger.credit('BLARGED');
    FakeServer.time = 3; badger.credit('GAVE_FEEDBACK');
    FakeServer.flushResponses();
    var names = div.find('.badge-ui-earned-badges li .badge-ui-name')
      .map(function() { return $(this).text(); }).get();
    deepEqual(names, ['Feedback Maniac', 'Blarg', 'First Login']);
  });
  
  test("unread badge count is updated", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    equal($('.badge-ui-unread', div).text(), '0');
    badger.credit('LOGGED_IN');
    FakeServer.flushResponses();
    equal($('.badge-ui-unread', div).text(), '1');
  });

  test("has-unread class is toggled", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    ok(!$('.badge-ui-icon').hasClass('has-unread'));
    badger.credit('LOGGED_IN');
    FakeServer.flushResponses();
    ok($('.badge-ui-icon').hasClass('has-unread'));
    badger.markAllBadgesAsRead();
    FakeServer.flushResponses();
    ok(!$('.badge-ui-icon').hasClass('has-unread'));
  });

  test("icon element gets forced animation restart", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    var iconBefore = $('.badge-ui-icon');
    badger.credit('LOGGED_IN');
    FakeServer.flushResponses();
    var iconAfter = $('.badge-ui-icon');
    equal(iconBefore.html(), iconAfter.html(),
      "html is identical");
    ok(iconBefore[0] !== iconAfter[0],
      "DOM nodes are different");
  });
  
  test("can set self.badger to null", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(null);
    ok(ui.badger === null);
  });

  test("detail popover visibility is toggled on click", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    equal($('.badge-ui-detail:visible', div).length, 0);
    $('.badge-ui-widget', div).click();
    equal($('.badge-ui-detail:visible', div).length, 1);
    $('.badge-ui-widget', div).click();
    equal($('.badge-ui-detail:visible', div).length, 0);
  });
  
  test("badges marked as read when detail popover is viewed", function() {
    var triggered = false;
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    badger.credit('LOGGED_IN');
    FakeServer.flushResponses();
    badger.on('change:unreadBadgeCount', function() {
      equal(badger.unreadBadgeCount, 0);
      triggered = true;
    });
    $('.badge-ui-widget', div).click();
    FakeServer.flushResponses();
    ok(triggered);
  });
  
  test("badge award popover is displayed", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    equal($('.badge-ui-alert:visible', div).length, 0);
    badger.credit('LOGGED_IN');
    FakeServer.flushResponses();
    equal($('.badge-ui-alert:visible', div).length, 1);
  });
  
  test("clicking on badge detail popover doesn't hide it", function() {
    var ui = BadgeUI(wmnav);
    ui.setBadger(badger);
    FakeServer.flushResponses();
    $('.badge-ui-widget', div).click();
    equal($('.badge-ui-detail:visible', div).length, 1);
    var child = $('.badge-ui-detail', div).children()[0];
    ok(child);
    $(child).click();
    equal($('.badge-ui-detail:visible', div).length, 1);
  });
  
  test("backpack panel display is toggled on window.OpenBadges", function() {
    var ui = BadgeUI(wmnav);
    window.OpenBadges = null;
    ui.setBadger(badger);
    badger.credit('LOGGED_IN');
    FakeServer.flushResponses();
    $('.badge-ui-widget', div).click();
    equal($(".badge-ui-push-to-backpack:visible", div).length, 0,
         "backpack panel not shown if window.OpenBadges is falsy");
    $('.badge-ui-widget', div).click();
    window.OpenBadges = {};
    $('.badge-ui-widget', div).click();
    equal($(".badge-ui-push-to-backpack:visible", div).length, 1,
         "backpack panel shown if window.OpenBadges is truthy");
  });
  
  test("clicking on + Backpack button invokes issuer API", function() {
    var ui = BadgeUI(wmnav);

    expect(3);
    window.OpenBadges = {
      issue_no_modal: function(assertions) {
        deepEqual(assertions, [
          "http://fake-clopenbadger/foo@bar.org/FIRST_LOGIN"
        ], "assertions passed to OpenBadges.issue() are correct");
      },
      issue: function(assertions, callback) {
        ok(false, 'should use modaless');
      }
    };
    ui.setBadger(badger);
    badger.credit('LOGGED_IN');
    FakeServer.flushResponses();
    $('.badge-ui-widget', div).click();
    equal($('.tooltip:visible', div).length, 1,
          "badge popover is visible before clicking + Backpack button");
    $(".badge-ui-push-to-backpack button", div).click();
    equal($('.tooltip:visible', div).length, 0,
         "badge popover hides after clicking + Backpack button");
  });

  asyncTest("badge-ui-ready class on widget when badger ready", function(){
    var ui = BadgeUI(wmnav);
    ok(!$('.badge-ui-widget').hasClass('badge-ui-ready'));
    ui.setBadger(badger);
    badger.on("ready", function(){
      ok($('.badge-ui-widget').hasClass('badge-ui-ready'));
      start();
    });
  });

  asyncTest("badge-ui-error class on widget when badger errors", function(){
    FakeServer.modifyQueuedResponses(function(info) {
      if (info.path == '/v1/badges') {
        info.response.status = 500;
        info.response.statusText = "Internal Server Error";
      }
    });
    var ui = BadgeUI(wmnav);
    ok(!$('.badge-ui-widget').hasClass('badge-ui-error'));
    ui.setBadger(badger);
    badger.on("error", function(){
      ok($('.badge-ui-widget').hasClass('badge-ui-error'));
      start();
    });
  });
});
