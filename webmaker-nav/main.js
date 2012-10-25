"use strict";

define( [ "jquery", "text!./templates/webmaker-nav.html" ],
  function( $, BASE_LAYOUT ) {

      // Added to elements in primary nav when they are active
  var BTN_ACTIVE_CLASS = "webmaker-btn-active";

  function setupTabs( root, tabContainer ) {
        // Added to tab when it's open
    var TAB_ACTIVE_CLASS = "webmaker-tab-active",
        // Added to body when secondary nav is expanded
        EXPANDED_CLASS = "webmaker-expanded",
         // The class prefix for each individual tab
        TAB_PREFIX = "tab-";

    var primary = $( ".primary", root ),
        window = root[0].ownerDocument.defaultView;

    primary.click(function webmakerTabSetup( e ) {
      var currentActiveBtn = $( "." + BTN_ACTIVE_CLASS, primary ),
          currentActiveTab = $( "." + TAB_ACTIVE_CLASS, tabContainer ),
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
        root.removeClass( EXPANDED_CLASS );
        return;
      }
      else {
        currentActiveTab.removeClass( TAB_ACTIVE_CLASS );
      }

      root.addClass( EXPANDED_CLASS );
      tab.addClass( TAB_ACTIVE_CLASS );
      el.addClass( BTN_ACTIVE_CLASS );
    });
    
    window.addEventListener("mousedown", function(event) {
      var isOutsideTab = !$(tabContainer).has(event.target).length;
      var isOutsidePrimary = !$(primary).has(event.target).length;

      if (isOutsideTab && isOutsidePrimary) {
        $( "." + BTN_ACTIVE_CLASS, primary ).click();
      }
    }, true);
  }
  
  return function( options ) {
    var customizations = $( "[webmaker-nav-role]", options.container ),
        root = $( options.container ).html( BASE_LAYOUT )
          .find( ".webmaker-nav-container" ),
        feedbackBtn = $( ".webmaker-feedback-btn", root ),
        loginBtn = $( ".wm-login-btn", root ),
        logoutBtn = $( ".logout-btn", root ),
        userMenu = $( ".tooltip-user", root ),
        username = $( ".user-name", root ),
        usernameInner = $( ".user-name-container", root ),
        tabContainer = $( ".webmaker-tabs", root ),
        feedbackCallback,
        loginBtnCallback,
        logoutBtnCallback,
        setupUserMenu,
        applyCustomizations;

    this.container = root;
    this.views = {
      login: function( context ) {
        root.addClass( "logged-in" );
        usernameInner.html( context.username );
      },
      logout: function() {
        root.removeClass( "logged-in" );
        userMenu.removeClass( "tooltip-no-transition-on" );
        username.removeClass( BTN_ACTIVE_CLASS );
      }
    };
    
    feedbackCallback = options.feedbackCallback;
    loginBtnCallback = options.loginBtnCallback;
    logoutBtnCallback = options.logoutBtnCallback;

    applyCustomizations = function() {
      var customizers = {
        'join-tooltip': function() {
          $('.wm-join-tooltip', root).empty().append(this);
        },
        'webmaker-info': function() {
          $('.webmaker-tab .secondary-info', tabContainer)
            .empty().append(this);
        },
        'user-options': function() {
          $(this).children().each(function() {
            logoutBtn.closest("li").before(this);
          });
        }
      };
      
      customizations.each(function() {
        var role = $(this).attr("webmaker-nav-role");
        if (role in customizers)
          customizers[role].call(this);
      });
    };
    
    setupUserMenu = function() {
      userMenu.click(function( e ) { e.stopPropagation(); });
      username.click(function() {
        userMenu.toggleClass( "tooltip-no-transition-on" );
        username.toggleClass( BTN_ACTIVE_CLASS );
      });
    };

    setupTabs( root, tabContainer );
    setupUserMenu();
    applyCustomizations();
    
    if ( feedbackCallback ) {
      feedbackBtn.click( feedbackCallback );
    } else {
      feedbackBtn.remove();
    }

    if ( loginBtnCallback && logoutBtnCallback ) {
      loginBtn.click( loginBtnCallback );
      logoutBtn.click( logoutBtnCallback );
      // Default view
      this.views.logout();
    } else {
      loginBtn.remove();
      logoutBtn.remove();
    }
  };
});
