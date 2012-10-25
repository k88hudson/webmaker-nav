"use strict";

define(["jquery"], function($) {
  return function ModeBuster(options) {
    var self = {},
        container = options.container,
        oncancel = options.oncancel,
        window = container[0].ownerDocument.defaultView;
    
    function onMouseDown(event) {
      var isOutsideModalArea = !$(container).has(event.target).length;

      if (isOutsideModalArea) {
        self.disable();
        oncancel();
      }
    }
    
    self.enable = function() {
      window.addEventListener("mousedown", onMouseDown, true);
    };
    
    self.disable = function() {
      window.removeEventListener("mousedown", onMouseDown, true);
    };
    
    return self;
  }
});
