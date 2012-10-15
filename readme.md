# Webmaker nav

This is a first iteration of the universal nav for Popcorn/Thimble. It includes a primary navigation and secondary navigation tabs, as well as a sample header.

## Usage

You will need [requirejs][].

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

Whenever the user logs in, you'll want to call:

```javascript
webmakerNav.views.login({username: "foo@bar.org"});
```

When the user logs out, just call:

```javascript
webmakerNav.views.logout();
```

For a full example, see `example/index.html`.

  [requirejs]: http://requirejs.org/
  [packages]: http://requirejs.org/docs/api.html#packages
