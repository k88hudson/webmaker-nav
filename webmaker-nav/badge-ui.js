"use strict";

define([
  "jquery",
  "./mode-buster",
  "text!./templates/badge-ui-widget.html",
  "text!./templates/badge-ui-list-item.html",
  "text!./templates/badge-ui-alert.html"
], function($, ModeBuster, WIDGET_HTML, LI_HTML, ALERT_HTML) {
  function getEarnedBadges(badger) {
    return badger.getBadges().filter(function(badge) {
      return badge.isEarned;
    }).sort(function(a, b) { return b.issuedOn - a.issuedOn; });
  }

  function getUnearnedBadges(badger) {
    return badger.getBadges().filter(function(badge) {
      return !badge.isEarned;
    }).sort(function(a, b) {
      if (a.name > b.name)
        return 1;
      else if (a.name < b.name)
        return -1;
      return 0;
    });
  }

  return function BadgeUI(webmakerNav, options) {
    options = options || {};

    var widget = $(WIDGET_HTML)
      .prependTo($(webmakerNav.container).find("ul.user-info"))
      .find(".badge-ui-widget");
    var alertContainer = $(options.alertContainer || widget);
    var alertSlideSpeed = options.alertSlideSpeed || 350;
    var alertDisplayTime = options.alertDisplayTime || 3200;
    var backpackPanel = widget.find(".badge-ui-push-to-backpack");
    var modeBuster = ModeBuster({
      container: widget,
      oncancel: function() {
        widget.click();
      }
    });

    var self = {
      badger: null,
      setBadger: function(badger) {
        function refreshBadgeList() {
          var unearnedBadgeList = $('.badge-ui-unearned-badges ul', widget)
            .empty();
          var earnedBadgeList = $('.badge-ui-earned-badges ul', widget)
            .empty();

          function makeBadgeList(badges, list) {
            list.parent().toggle(!!badges.length);
            badges.forEach(function(badge) {
              var item = $(LI_HTML);
              $('.badge-ui-name', item).text(badge.name);
              $('.badge-ui-desc', item).text(badge.description);
              $('img', item).attr("src", badge.image);
              item.appendTo(list);
            });
          }

          makeBadgeList(getUnearnedBadges(badger), unearnedBadgeList);
          makeBadgeList(getEarnedBadges(badger), earnedBadgeList);
        }

        self.badger = badger;
        if (!badger)
          return;

        badger.on("change:unreadBadgeCount", function() {
          var unread = badger.unreadBadgeCount;
          $('.badge-ui-unread', widget).toggle(unread > 0)
            .text(unread.toString());
          $('.badge-ui-icon', widget).toggleClass('has-unread', unread > 0);
          var icon = $('.badge-ui-icon');
          var newOne = icon.clone(true);
          icon.replaceWith(newOne); /* this "restarts" CSS animations on
            .badge-ui-icon or its children */
        });
        badger.on("change:availableBadges", refreshBadgeList);
        badger.on("change:earnedBadges", refreshBadgeList);
        badger.on("award", function(awards) {
          awards.forEach(function(shortname) {
            var badge = badger.availableBadges[shortname];
            var alert = $(ALERT_HTML);
            $(".badge-ui-name", alert).text(badge.name);
            $("img", alert).attr("src", badge.image);
            alert.appendTo(alertContainer)
              .children()
              .hide()
              .slideDown(alertSlideSpeed)
              .delay(alertDisplayTime)
              .slideUp(alertSlideSpeed, function() { alert.remove(); });
          });
        });
      }
    };

    widget.click(function(event) {
      if ($(event.target).closest(".tooltip-big").length)
        // They clicked in a popover, not on the widget itself, so don't
        // toggle any menus.
        return;
      $(this).toggleClass("badge-ui-on");
      if ($(this).hasClass("badge-ui-on")) {
        if (self.badger)
          self.badger.markAllBadgesAsRead();
        backpackPanel.toggle(!!window.OpenBadges);
        modeBuster.enable();
      } else {
        modeBuster.disable();
      }
      $(".badge-ui-alert", widget).remove();
    });

    $("button", backpackPanel).click(function() {
      var assertions = [];
      widget.click();
      Object.keys(self.badger.earnedBadges).forEach(function(shortname) {
        assertions.push(self.badger.earnedBadges[shortname].assertionUrl);
      });
      window.OpenBadges.issue_no_modal(assertions);
    });

    return self;
  };
});
