define( [ "webmaker-nav"], function( Webmaker ) {

  // Normally you would pass your actual app 
  var testApp = {
    username: "testuser@mozilla.org"
  };

  // Don't actually call view functions here. Just for demonstration
  var webmakerNav = new Webmaker( testApp, {
    container: document.querySelector( "#webmaker" ),
    loginBtnCallback: function() {
      webmakerNav.views.login();
    },
    logoutBtnCallback: function() {
      webmakerNav.views.logout();
    },
    feedbackCallback: function() {
      console.log( "do feedback stuff" );
    }
  });
});
