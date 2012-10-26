"use strict";

defineTests([
  "jquery",
  "webmaker-nav"
], function($, WebmakerNav) {
  module("webmaker-nav", {
    setup: function() {
      container = $('<div></div>').appendTo(document.body).hide();
    },
    teardown: function() {
      container.remove();
    }
  });
  
  var LOGIN_BTN = ".wm-login-btn",
      LOGOUT_BTN = ".logout-btn",
      FEEDBACK_BTN = ".webmaker-feedback-btn",
      USER_MENU = ".tooltip-user";
  
  var container;
  
  test("contains .webmaker-nav-container", function() {
    var webmakerNav = new WebmakerNav({container: container});
    equal(container.find(".webmaker-nav-container").length, 1);
  });
  
  test("has no login button if no cb given", function() {
    var webmakerNav = new WebmakerNav({container: container});
    equal(container.find(LOGIN_BTN).length, 0);
  });
  
  test("has working login/logout buttons if cbs given", function() {
    var login = false;
    var logout = false;
    var webmakerNav = new WebmakerNav({
      container: container,
      loginBtnCallback: function() { login = true; },
      logoutBtnCallback: function() { logout = true }
    });

    equal(container.find(LOGIN_BTN).length, 1, "has login btn");
    equal(container.find(LOGOUT_BTN).length, 1, "has logout btn");
    ok(!login, "login cb not triggered");
    ok(!logout, "login cb not triggered");

    $(LOGIN_BTN, container).click();
    ok(login, "login cb triggered");

    $(LOGOUT_BTN, container).click();
    ok(logout, "logout cb triggered");
  });
  
  test("has no feedback button if no cb given", function() {
    var webmakerNav = new WebmakerNav({container: container});
    equal(container.find(FEEDBACK_BTN).length, 0);
  });
  
  test("has working feedback button if cb given", function() {
    var feedback = false;
    var webmakerNav = new WebmakerNav({
      container: container,
      feedbackCallback: function() { feedback = true; }
    });
    equal(container.find(FEEDBACK_BTN).length, 1, "has feedback btn");
    ok(!feedback, "feedback cb not triggered");
    $(FEEDBACK_BTN, container).click();
    ok(feedback, "feedback cb triggered");
  });
  
  test("logout view is default", function() {
    var webmakerNav = new WebmakerNav({
      container: container.show(),
      loginBtnCallback: function() {},
      logoutBtnCallback: function() {}
    });
    equal(container.find(LOGIN_BTN + ":visible").length, 1,
          "login btn is visible");
  });

  test("login view works", function() {
    var webmakerNav = new WebmakerNav({
      container: container.show(),
      loginBtnCallback: function() {},
      logoutBtnCallback: function() {}
    });
    webmakerNav.views.login({username: "blegh"});
    equal(container.find(LOGIN_BTN + ":visible").length, 0,
          "login btn is not visible");
    equal(container.find(".user-name-container").text(), "blegh",
          "user menu contains username");
    webmakerNav.views.logout();
    equal(container.find(LOGIN_BTN + ":visible").length, 1,
          "login btn is visible again after logout");
  });

  test("logging out hides user menu", function() {
    var webmakerNav = new WebmakerNav({
      container: container.show(),
      loginBtnCallback: function() {},
      logoutBtnCallback: function() {}
    });
    var userMenu = container.find(USER_MENU);
    var usernameWidget = container.find(".user-name");

    webmakerNav.views.login({username: "blegh"});
    equal($(LOGOUT_BTN, container).css("visibility"), "hidden",
         "logout button not visible before activating user menu");
    usernameWidget.click();
    equal($(LOGOUT_BTN, container).css("visibility"), "visible",
         "logout button is visible after activating user menu");
    webmakerNav.views.logout();
    equal(userMenu.css("visibility"), "hidden",
          "user menu is hidden after logging out");
  });
  
  test("clicking on user menu toggles its visibility", function() {
    var webmakerNav = new WebmakerNav({
      container: container.show(),
      loginBtnCallback: function() {},
      logoutBtnCallback: function() {}
    });
    var userMenu = container.find(USER_MENU);
    var usernameWidget = container.find(".user-name");
    
    webmakerNav.views.login({username: "blegh"});
    equal(userMenu.css("visibility"), "hidden",
          "user menu is hidden by default");
    usernameWidget.click();
    equal(userMenu.css("visibility"), "visible",
          "user menu is visible after clicking on it");
    usernameWidget.click();
    equal(userMenu.css("visibility"), "hidden",
          "user menu is hidden after clicking on it again");
  });
  
  test("clicking on a tab shows its content, hides others", function() {
    function isTabActive(name) {
      return $(".tab-" + name, container).hasClass("webmaker-tab-active");
    }

    var webmakerNav = new WebmakerNav({container: container.show()});

    ok(!isTabActive("projects"), "projects tab isn't active before click");
    $("a[data-tab='projects']", container).click();
    ok(isTabActive("projects"), "projects tab is active after click");
    $("a[data-tab='webmaker']", container).click();
    ok(!isTabActive("projects"), "projects tab isn't active after " +
                                 "clicking on another tab");
  });
  
  test("customizable user-options entries work", function() {
    var ul = $('<ul data-webmaker-nav-role="user-options"></ul>')
      .appendTo(container);
    var firstEntry = $('<li>hello</li>').appendTo(ul);
    var secondEntry = $('<li>there</li>').appendTo(ul);
    var logout = false;
    var webmakerNav = new WebmakerNav({
      container: container,
      loginBtnCallback: function() {},
      logoutBtnCallback: function() { logout = true; }
    });
    equal($(".user-name ul").children().length, 3);
    ok($(".user-name ul").children()[0] === firstEntry[0]);
    ok($(".user-name ul").children()[1] === secondEntry[0]);
    $(".user-name ul .logout-btn").click();
    ok(logout);
  });
  
  test("customizable webmaker-info content works", function() {
    var info = $('<div data-webmaker-nav-role="webmaker-info">hi</div>');
    var webmakerNav = new WebmakerNav({container: container.append(info)});
    equal($(".webmaker-tab .secondary-info").children().length, 1);
    ok($(".webmaker-tab .secondary-info").children()[0] === info[0]);
    equal(info.text(), 'hi');
  });
  
  test("customizable join-tooltip content works", function() {
    var info = $('<div data-webmaker-nav-role="join-tooltip">hi</div>');
    var webmakerNav = new WebmakerNav({
      container: container.append(info),
      loginBtnCallback: function() {},
      logoutBtnCallback: function() {}
    });
    equal($(".wm-join-tooltip").children().length, 1);
    ok($(".wm-join-tooltip").children()[0] === info[0]);
    equal(info.text(), 'hi');
  });
});
