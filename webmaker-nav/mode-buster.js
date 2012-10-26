"use strict";

define(["jquery"], function($) {
  return function ModeBuster(options) {
    var self = {},
        isEnabled = false,
        container = options.container,
        oncancel = options.oncancel,
        window = container[0].ownerDocument.defaultView;
    
    function onMouseDown(event) {
      var isOutsideModalArea = !$(container).has(event.target).length &&
                               !$(container).is(event.target);

      if (isOutsideModalArea) {
        self.disable();
        oncancel();
      }
    }
    
    self.setEnabled = function(setEnabled) {
      setEnabled ? self.enable() : self.disable();
    };

    self.isEnabled = function() {
      return isEnabled;
    };
    
    self.enable = function() {
      if (!isEnabled) {
        window.addEventListener("mousedown", onMouseDown, true);
        isEnabled = true;
      }
    };
    
    self.disable = function() {
      if (isEnabled) {
        window.removeEventListener("mousedown", onMouseDown, true);
        isEnabled = false;
      }
    };
    
    return self;
  }
});
