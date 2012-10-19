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
  
  var LOGIN_BTN = ".login",
      LOGOUT_BTN = ".logout-btn",
      FEEDBACK_BTN = ".webmaker-feedback-btn";
  
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
});
