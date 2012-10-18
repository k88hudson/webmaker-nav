define( [ "jquery", "text!./templates/webmaker-nav.html" ],
  function( $, BASE_LAYOUT ) {

      // Added to tab when it's open
  var TAB_ACTIVE_CLASS = "webmaker-tab-active",
      // Added to elements in primary nav when they are active
      BTN_ACTIVE_CLASS = "webmaker-btn-active",
      // Added to body when secondary nav is expanded
      EXPANDED_CLASS = "webmaker-expanded",
       // The class prefix for each individual tab
      TAB_PREFIX = "tab-";

  return function( options ) {
    var _this = this,
        root = $( options.container );

    $( root ).html(BASE_LAYOUT);

    var feedbackBtn = $( ".webmaker-feedback-btn", root ),
        personaBtnGroup = $( ".login-join", root ),
        loginBtn = $( ".login", root ),
        logoutBtn = $( ".logout-btn", root ),
        userMenu = $( ".tooltip-user", root ),
        username = $( ".user-name", root ),
        usernameInner = $( ".user-name-container", root ),
        usernameContainer= $( ".user", root ),
        primary = $( ".primary", root ),
        tabContainer = $( ".webmaker-tabs", root ),
        feedbackCallback,
        loginBtnCallback,
        logoutBtnCallback,
        userMenuSetup;

    this.views = {
      login: function( context ) {
        personaBtnGroup.hide();
        usernameContainer.show();
        usernameInner.html( context.username );
      },
      logout: function() {
        personaBtnGroup.show();
        usernameContainer.hide();
        userMenu.removeClass( "tooltip-no-transition-on" );
        username.removeClass( BTN_ACTIVE_CLASS );
      }
    };

    feedbackCallback = options.feedbackCallback;
    loginBtnCallback = options.loginBtnCallback;
    logoutBtnCallback = options.logoutBtnCallback;

    primary.click(function webmakerTabSetup( e ) {
      var currentActiveBtn = $( "." + BTN_ACTIVE_CLASS, primary ),
          currentActiveTab = $( "." + TAB_ACTIVE_CLASS ),
          el = $( e.target ),
          tabName,
          tab;

      tabName = el.attr( "data-tab" );
      tab = $( "." + TAB_PREFIX + tabName, tabContainer );

      if ( !tab.length ) {
        return;
      }
      currentActiveBtn.removeClass( BTN_ACTIVE_CLASS );
      if ( currentActiveTab.is( tab ) ) {
        currentActiveTab.removeClass( TAB_ACTIVE_CLASS );
        $( document.body ).removeClass( EXPANDED_CLASS );
        return;
      }
      else {
        currentActiveTab.removeClass( TAB_ACTIVE_CLASS );
      }

      $( document.body ).addClass( EXPANDED_CLASS );
      tab.addClass( TAB_ACTIVE_CLASS );
      el.addClass( BTN_ACTIVE_CLASS );
    });

    userMenuSetup = function() {
      userMenu.click(function( e ) { e.stopPropagation(); });
      username.click(function() {
        userMenu.toggleClass( "tooltip-no-transition-on" );
        username.toggleClass( BTN_ACTIVE_CLASS );
      });
    };

    userMenuSetup();

    if ( feedbackCallback ) {
      feedbackBtn.click( feedbackCallback );
    } else {
      feedbackBtn.remove();
    }

    if ( loginBtnCallback && logoutBtnCallback ) {
      loginBtn.click(loginBtnCallback);
      logoutBtn.click(logoutBtnCallback);
      // Default view
      this.views.logout();
    } else {
      loginBtn.remove();
      logoutBtn.remove();
    }
  };
});
