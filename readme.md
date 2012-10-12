### Webmaker nav

This is a first iteration of the universal nav for Popcorn/Thimble. It includes a primary navigation and secondary navigation tabs, as well as a sample header.

Usage:
```
var webmakerNav = new Webmaker( testApp, {
  container: document.querySelector( "#webmakerContainer" ),
  loginBtnCallback: myLoginFunction,
  logoutBtnCallbak: myLogoutFunction,
  feedbackCallback: myFeedbackFunction
});
```
