document.addEventListener( "DOMContentLoaded", function(){

  var webmakerPrimaryNav = document.querySelector( ".webmaker-nav.primary" ),
      tabContainer = document.querySelector( ".webmaker-tabs" ),
      feedbackBtn = document.querySelector( ".webmaker-feedback-btn" ),
      BUTTON_ACTIVE_CLASS = "active", // This gets added to buttons in the primary nav
      TAB_ACTIVE_CLASS = "open", // The open state for tabs
      TAB_PREFIX = "tab-", // e.g. tab-projects, tab-tools, etc...
      webmakerTabSetup;

  webmakerTabSetup = function( e ) {
    var currentActiveBtn = webmakerPrimaryNav.querySelector( "." + BUTTON_ACTIVE_CLASS ),
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
      currentActiveBtn.classList.remove( BUTTON_ACTIVE_CLASS );
    }
    if ( currentActiveTab === tab ) {
      currentActiveTab.classList.remove( TAB_ACTIVE_CLASS );
      return;
    }
    else if ( currentActiveTab ) {
      currentActiveTab.classList.remove( TAB_ACTIVE_CLASS );
    }

    document.body.classList.add( "webmaker-expanded" );
    tab.classList.add( TAB_ACTIVE_CLASS );
    el.classList.add( BUTTON_ACTIVE_CLASS );
  };

  webmakerPrimaryNav.addEventListener( "click", webmakerTabSetup, false );

}, false);
