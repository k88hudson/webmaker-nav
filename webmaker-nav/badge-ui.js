"use strict";

define([
  "jquery",
  "text!./templates/badge-ui-widget.html",
  "text!./templates/badge-ui-list-item.html",
  "text!./templates/badge-ui-alert.html"
], function($, WIDGET_HTML, LI_HTML, ALERT_HTML) {
  return function BadgeUI(webmakerNav, options) {
    options = options || {};
    
    var widget = $(WIDGET_HTML)
      .prependTo($(webmakerNav.container).find("ul.user-info"));
    var alertContainer = $(options.alertContainer || document.body);
    var alertDisplayTime = options.alertDisplayTime || 2000;

    var self = {
      badger: null,
      setBadger: function(badger) {
        function refreshBadgeList() {
          var badgeList = $('.badge-ui-badges', widget).empty();
          var available = badger.availableBadges;
          var earned = badger.earnedBadges;

          Object.keys(available).forEach(function(shortname) {
            var badge = available[shortname];
            var item = $(LI_HTML);
            $('.badge-ui-name', item).text(badge.name);
            $('img', item).attr("src", badge.image);
            item.toggleClass("badge-ui-earned", shortname in earned)
              .appendTo(badgeList);
          });
        }
        
        self.badger = badger;
        if (!badger)
          return;
        
        badger.on("change:unreadBadgeCount", function() {
          var unread = badger.unreadBadgeCount;
          $('.badge-ui-unread', widget).toggle(unread > 0)
            .text(unread.toString());
        });
        badger.on("change:availableBadges", refreshBadgeList);
        badger.on("change:earnedBadges", refreshBadgeList);
        badger.on("award", function(awards) {
          awards.forEach(function(shortname) {
            var badge = badger.availableBadges[shortname];
            var alert = $(ALERT_HTML);
            $(".badge-ui-name", alert).text(badge.name)
            alert.appendTo(alertContainer);
            setTimeout(function() { alert.remove(); }, alertDisplayTime);
          });
        });
      }
    };

    widget.click(function() {
      $(this).toggleClass("badge-ui-on");
      if (self.badger)
        self.badger.markAllBadgesAsRead();
    });

    return self;
  };
});
