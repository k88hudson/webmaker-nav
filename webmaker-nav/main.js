define( [ "text!./templates/webmaker-nav.html" ],
  function( BASE_LAYOUT ) {

      // Added to tab when it's open
  var TAB_ACTIVE_CLASS = "webmaker-tab-active",
      // Added to elements in primary nav when they are active
      BTN_ACTIVE_CLASS = "webmaker-btn-active",
      // Added to body when secondary nav is expanded
      EXPANDED_CLASS = "webmaker-expanded",
       // The class prefix for each individual tab
      TAB_PREFIX = "tab-";

  return function( app, options ) {
    var _this = this,
        root = options.container;

    root.innerHTML = BASE_LAYOUT;

    var feedbackBtn = root.querySelector( ".webmaker-feedback-btn" ),
        personaBtnGroup = root.querySelector( ".login-join" ),
        loginBtn = root.querySelector( ".login" ),
        logoutBtn = root.querySelector( ".logout-btn" ),
        userMenu = root.querySelector( ".tooltip-user" ),
        username = root.querySelector( ".user-name" ),
        usernameInner = root.querySelector( ".user-name-container" ),
        usernameContainer= root.querySelector( ".user" ),
        primary = root.querySelector( ".primary" ),
        tabContainer = root.querySelector( ".webmaker-tabs" ),
        feedbackCallback,
        loginBtnCallback,
        logoutBtnCallback,
        webmakerTabSetup,
        userMenuSetup;

    this.views = {
      login: function() {
        personaBtnGroup.style.display = "none";
        usernameContainer.style.display = "";
        // You'll want to set the username here
        usernameInner.innerHTML = app.username;
      },
      logout: function() {
        personaBtnGroup.style.display = "";
        usernameContainer.style.display = "none";
        userMenu.classList.remove( "tooltip-no-transition-on" );
        username.classList.remove( BTN_ACTIVE_CLASS );
      }
    };

    feedbackCallback = options.feedbackCallback;
    loginBtnCallback = options.loginBtnCallback;
    logoutBtnCallback = options.logoutBtnCallback;

    webmakerTabSetup = function( e ) {
      var currentActiveBtn = primary.querySelector( "." + BTN_ACTIVE_CLASS ),
          currentActiveTab = tabContainer.querySelector( "." + TAB_ACTIVE_CLASS ),
          el = e.target,
          tabName,
          tab;

      tabName = el.getAttribute( "data-tab" );
      tab = tabContainer.querySelector( "." + TAB_PREFIX + tabName );

      if ( !tab ) {
        return;
      }
      if ( currentActiveBtn ) {
        currentActiveBtn.classList.remove( BTN_ACTIVE_CLASS );
      }
      if ( currentActiveTab === tab ) {
        currentActiveTab.classList.remove( TAB_ACTIVE_CLASS );
        document.body.classList.remove( EXPANDED_CLASS );
        return;
      }
      else if ( currentActiveTab ) {
        currentActiveTab.classList.remove( TAB_ACTIVE_CLASS );
      }

      document.body.classList.add( EXPANDED_CLASS );
      tab.classList.add( TAB_ACTIVE_CLASS );
      el.classList.add( BTN_ACTIVE_CLASS );
    };

    userMenuSetup = function() {
      userMenu.addEventListener( "click", function( e ) {
        e.stopPropagation();
      }, false );

      username.addEventListener( "click", function() {
        userMenu.classList.toggle( "tooltip-no-transition-on" );
        username.classList.toggle( BTN_ACTIVE_CLASS );
      }, false );
    };

    userMenuSetup();

    if ( feedbackCallback ) {
      feedbackBtn.addEventListener( "click", feedbackCallback, false );
    } else {
      feedbackBtn.parentNode.removeChild( feedbackBtn );
    }

    loginBtn.addEventListener( "click", loginBtnCallback, false );
    logoutBtn.addEventListener( "click", logoutBtnCallback, false );
    primary.addEventListener( "click", webmakerTabSetup, false );

    /*
    // You can set up login/logout views on different events or handle them some other way
    // e.g.
    app.listen( "authenticated", _this.views.login, false );
    app.listen( "logout", _this.views.logout, false );
    */

    // Default view
    this.views.logout();

  };
});
