define( [ "webmaker-nav/webmaker-nav"], function( Webmaker ) {

  // Normally you would pass your actual app 
  var testApp = {
    username: "testuser"
  };

  var webmakerNav = new Webmaker( testApp, {
    container: document.querySelector( "#webmaker" ),
    loginBtnCallback: function() {
      console.log( "login" );
    },
    logoutBtnCallbak: function() {
      console.log( "logout" );
    },
    feedbackCallback: function() {
      console.log( "do feedback stuff" );
    }
  });
});
