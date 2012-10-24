[![Build Status](https://travis-ci.org/k88hudson/webmaker-nav.png)](https://travis-ci.org/k88hudson/webmaker-nav)

# Webmaker nav

This is a first iteration of the universal nav for Popcorn/Thimble. It includes a primary navigation and secondary navigation tabs, as well as a sample header.

## Usage

You will need [requirejs][] and [jquery][].

First, copy the `webmaker-nav` subdirectory of this repository into your project.

It is a CommonJS package, so you will need to add a [packages][]
directive to your require config that points at the subdirectory.

You'll also need to add a `<link>` tag that points to `webmaker-nav/css/webmaker-nav.css`.

Then, you should be able to use the module like this:

```javascript
require(["webmaker-nav"], function(WebmakerNav) {
  var webmakerNav = new WebmakerNav({
    container: document.querySelector("#webmakerNavContainer"),
    loginBtnCallback: function myLoginFunction() { /* ... */ },
    logoutBtnCallbak: function myLogoutFunction() { /* ... */ },
    feedbackCallback: function myFeedbackFunction() { /* ... */ }
  });
});
```

If `feedbackCallback` is omitted, the feedback button will not be displayed.
Both `loginBtnCallback` and `logoutBtnCallback` must be defined in order for the logout/login buttons to appear.

Whenever the user logs in, you'll want to call:

```javascript
webmakerNav.views.login({username: "foo@bar.org"});
```

When the user logs out, just call:

```javascript
webmakerNav.views.logout();
```

Customizations to the HTML content of the nav bar can be added by
pre-populating the container with custom content, e.g.:

```html
<div id="webmakerNavContainer">
  <div webmaker-nav-role="webmaker-info">
    This content will appear on the right side of the content of the
    Webmaker tab.
  </div>
  <div webmaker-nav-role="join-tooltip">
    <div class="wm-unit">
      <h3>Log in to my awesome app to do awesome stuff!</h3>
      <div class="wm-unit-side">
        <img src="some-image">
      </div>
      <div class="wm-unit-body">
        <p>Don't have an account yet? All you need is an email to get started. Webmaker uses <strong>Persona</strong>, which puts you in control of your identity through a single email address of your choice.</p>
      </div>
    </div>
  </div>
  </div>
  <ul webmaker-nav-role="user-options">
    <!-- Any items added here will be added to the user options menu before
         the final logout entry. -->
    <li><a href="#/dashboard">My Projects</a></li>
  </ul>
</div>
```

For a full example, see `example/index.html`.

  [jquery]: http://jquery.com/
  [requirejs]: http://requirejs.org/
  [packages]: http://requirejs.org/docs/api.html#packages
