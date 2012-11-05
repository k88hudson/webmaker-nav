"use strict";

define( [ 
  "jquery",
  "./mode-buster",
  "text!./templates/webmaker-nav.html",
  "text!./templates/login-error.html"
], function( $, ModeBuster, BASE_LAYOUT, LOGIN_ERROR_LAYOUT ) {

      // Added to elements in primary nav when they are active
  var BTN_ACTIVE_CLASS = "webmaker-btn-active",
      // Default ms to display login errors for
      LOGIN_ERROR_DURATION = 5000;

  function setupTabs( root, tabContainer ) {
        // Added to tab when it's open
    var TAB_ACTIVE_CLASS = "webmaker-tab-active",
        // Added to body when secondary nav is expanded
        EXPANDED_CLASS = "webmaker-expanded",
         // The class prefix for each individual tab
        TAB_PREFIX = "tab-";

    var primary = $( ".primary", root ),
        modeBuster = ModeBuster({
          container: primary.add( tabContainer ),
          oncancel: function() {
            $( "." + BTN_ACTIVE_CLASS, primary ).click();
          }
        });

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
        modeBuster.disable();
        return;
      }
      else {
        currentActiveTab.removeClass( TAB_ACTIVE_CLASS );
      }

      root.addClass( EXPANDED_CLASS );
      tab.addClass( TAB_ACTIVE_CLASS );
      el.addClass( BTN_ACTIVE_CLASS );
      modeBuster.enable();
    });
  }
  
  function UserMenuUI( container ) {
    var self = {},
        usernameInner = $( ".user-name-container", container ),
        userMenu = $( ".tooltip-user", container ),
        modeBuster = ModeBuster({
          container: container,
          oncancel: function() { self.toggle( false ); }
        });
    
    self.setUsername = function( username ) {
      usernameInner.text( username );
    };
    
    self.toggle = function( optionalSwitch ) {
      userMenu.toggleClass( "tooltip-no-transition-on", optionalSwitch );
      container.toggleClass( BTN_ACTIVE_CLASS, optionalSwitch );
      modeBuster.setEnabled( container.hasClass( BTN_ACTIVE_CLASS ) );
    };
    
    userMenu.click(function( e ) { e.stopPropagation(); });
    container.click(function() { self.toggle(); });
    
    return self;
  }
  
  return function( options ) {
    var customizations = $( "[data-webmaker-nav-role]", options.container )
          .remove(),
        root = $( options.container ).html( BASE_LAYOUT )
          .find( ".webmaker-nav-container" ),
        feedbackBtn = $( ".webmaker-feedback-btn", root ),
        loginBtn = $( ".wm-login-btn", root ),
        logoutBtn = $( ".logout-btn", root ),
        tabContainer = $( ".webmaker-tabs", root ),
        userMenuUI = UserMenuUI( $( ".user-name", root ) ),
        feedbackCallback,
        loginBtnCallback,
        logoutBtnCallback,
        applyCustomizations;

    this.container = root;
    this.showLoginError = function(options) {
      options = options || {};
      var duration = options.duration || LOGIN_ERROR_DURATION;
      var setTimeout = options.setTimeout || window.setTimeout;
      var loginBtnContainer = loginBtn.parent();
      var tooltips = $( ".tooltip", loginBtnContainer )
        .css( "display", "none" );
      var error = $( LOGIN_ERROR_LAYOUT ).appendTo( loginBtnContainer );
      setTimeout(function() {
        error.remove();
        tooltips.css( "display", "" );
      }, duration);
    };
    this.views = {
      login: function( context ) {
        root.addClass( "logged-in" );
        userMenuUI.setUsername( context.username );
      },
      logout: function() {
        root.removeClass( "logged-in" );
        userMenuUI.toggle( false );
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
        var role = $(this).attr("data-webmaker-nav-role");
        if (role in customizers)
          customizers[role].call(this);
      });
    };

    setupTabs( root, tabContainer );
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
