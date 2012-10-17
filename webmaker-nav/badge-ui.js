"use strict";

define(["jquery"], function($) {
  return function BadgeUI(webmakerNav, options) {
    options = options || {};
    
    var container = $('<li class="user-badges"></li>')
      .prependTo($(webmakerNav.container).find("ul.user-info"));
    var alertContainer = $(options.alertContainer || document.body);
    var alertDisplayTime = options.alertDisplayTime || 2000;

    var self = {
      badger: null,
      setBadger: function(badger) {
        this.badger = badger;
        if (badger)
          onLogin();
        else
          onLogout();
      }
    };

    function onLogin() {
      var widget = $('<div class="badge-ui-widget"></div>');
      var unreadCount = $('<div class="badge-ui-unread"></div>')
        .appendTo(widget);
      var badgeList = $('<ul class="badge-ui-badges"></ul>')
        .appendTo(widget);
        
      function refreshBadgeList() {
        var available = self.badger.availableBadges;
        var earned = self.badger.earnedBadges;
        badgeList.empty();
        Object.keys(available).forEach(function(shortname) {
          var badge = available[shortname];
          var item = $('<li></li>').text(badge.name);
          if (shortname in earned)
            item.addClass("badge-ui-earned");
          badgeList.append(item);
        });
      }

      container.empty().append(widget);
      widget.click(function() {
        $(this).toggleClass("badge-ui-on");
        self.badger.markAllBadgesAsRead();
      });
      self.badger.on("change:unreadBadgeCount", function() {
        unreadCount.text(self.badger.unreadBadgeCount.toString());
      });
      self.badger.on("change:availableBadges", refreshBadgeList);
      self.badger.on("change:earnedBadges", refreshBadgeList);
      self.badger.on("award", function(awards) {
        awards.forEach(function(shortname) {
          var badge = self.badger.availableBadges[shortname];
          var alert = $('<div class="ui-badge-alert"></div>');
          alert.text(badge.name).appendTo(alertContainer);
          setTimeout(function() { alert.remove(); }, alertDisplayTime);
        });
      });
    }

    function onLogout() {
      container.empty();
    }
    
    return self;
  };
});
