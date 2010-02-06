//
//
//
var SB_Base = {
  
  firstValue: function() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] !== undefined) {
        return arguments[i];
      }
    }
    return undefined;
  },

  //
  //
  //
  getCenterPosition: function(element) {
    var dim_popup = Element.getDimensions(element);
    var popup_width = dim_popup.width;
    var popup_height = dim_popup.height;
    
    var dim_viewport = this.getViewportDimensions();
    var viewport_width = dim_viewport.width;
    var viewport_height = dim_viewport.height;

    var x;
    if (popup_width >= viewport_width) {
      x = 0;
    }
    else {
      x = (viewport_width - popup_width)/2;
    }

    var y;
    if (popup_height >= viewport_height) {
      y = 0;
    }
    else {
      y = (viewport_height - popup_height)/2;
    }
    
    return {x:x, y:y}
  },
  
  getBelowPosition: function(base_element) {
    var pos = Position.cumulativeOffset($(base_element));
    return {x: pos[0], y: pos[1] + Element.getHeight(base_element)};
  },

  getAutoPosition: function(mouse_x, mouse_y) {
    dim = Element.getDimensions(this.popup);
    var popup_width = dim.width;
    var popup_height = dim.height;
    dim = this.get_viewport_dimensions();
    var viewport_width = dim.width;
    var viewport_height = dim.height;

    var available_right = viewport_width - (mouse_x + this.options.cursor_margin);
    var available_left = mouse_x - this.options.cursor_margin;
    var available_top = mouse_y - this.options.cursor_margin;
    var available_bottom = viewport_height - (mouse_x + this.options.cursor_margin);
    var offset = this.options.cursor_margin;
    var x = mouse_x;
    var y = mouse_y;

    if (popup_width >= viewport_width) {
      x = 0;
    }
    else if (popup_width <= available_right) {
      x += offset;
    }
    else if (popup_width <= available_left) {
      x -= popup_width + offset;
    }
    else if (available_right >= available_left) {
      x = viewport_width - popup_width;
    }
    else {
      x = 0;
    }

    if (popup_height >= viewport_height) {
      y = 0;
    }
    else if (popup_height <= available_bottom) {
      y += offset;
    }
    else if (popup_height <= available_top) {
      y -= popup_height + offset;
    }
    else if (available_bottom >= available_top) {
      y = viewport_height - popup_height;
    }
    else {
      y = 0;
    }

    return {x: x, y: y}; 
  },

  getViewportDimensions: function() {
		var dim = this.getPageSize();
    return {width: dim[2], height: dim[3]};
  },

  getPageDimensions: function() {
		var dim = this.getPageSize();
    return {width: dim[0], height: dim[1]};
  },

  // This function from Lightbox v2.02 by Lokesh Dhakar
  // (http://www.huddletogether.com/projects/lightbox2/).
  //
  // Returns array with page width, height and window width, height
  // Core code from - quirksmode.org
  // Edit for Firefox by pHaez
  //
  getPageSize: function() {
    var xScroll, yScroll;

    if (window.innerHeight && window.scrollMaxY) {	
      xScroll = document.body.scrollWidth;
      yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
      xScroll = document.body.scrollWidth;
      yScroll = document.body.scrollHeight;
    } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
      xScroll = document.body.offsetWidth;
      yScroll = document.body.offsetHeight;
    }

    var windowWidth, windowHeight;
    if (self.innerHeight) {	// all except Explorer
      windowWidth = self.innerWidth;
      windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
      windowWidth = document.documentElement.clientWidth;
      windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
      windowWidth = document.body.clientWidth;
      windowHeight = document.body.clientHeight;
    }	
    
    // for small pages with total height less then height of the viewport
    if(yScroll < windowHeight){
      pageHeight = windowHeight;
    } else { 
      pageHeight = yScroll;
    }

    // for small pages with total width less then width of the viewport
    if(xScroll < windowWidth){	
      pageWidth = windowWidth;
    } else {
      pageWidth = xScroll;
    }

    arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
    return arrayPageSize;
  }
  
};





//
//
//
var SB_Popup = Class.create();

SB_Popup.prototype = Object.extend(SB_Base, {

  initialize: function(popup) {
    
    var options = Object.extend({
      modal: false
    }, arguments[2] || {});

    options.duration = this.firstValue(options.duration, 0.3);
    options.show_duration = this.firstValue(options.show_duration, options.duration);
    options.hide_duration = this.firstValue(options.hide_duration, options.duration);
    options.opacity = this.firstValue(options.opacity, 0.6);
    this.options = options;

    this.popup = $(popup);
    this.popup.popup = this;  // Make the popup object a property of the DOM popup element
    
    this.popup.addClassName("SB_Popup_popup");
    
    this.is_open = false;
  },

  
  //
  //
  //
  showPopup: function(position, object) {
    var pos;
    
    console.log($(object).innerHTML)
    
    if (position == "below") {
      pos = this.getBelowPosition(object);
    }
    else if (position == "auto") {
      
    }


    Element.setStyle(this.popup, { top: pos.y + "px", left: pos.x + "px" });
    new Effect.Appear(this.popup, { duration: this.options.show_duration });

    this.is_open = true;
  },
  
  closePopup: function() {
    new Effect.Fade(this.popup, { duration: this.options.hide_duration });
    this.is_open = false;
  },

  togglePopup: function(position, object) {
    if (this.is_open) this.closePopup();
    else this.showPopup(position, object);
  },
  
  //
  //
  //
  showModal: function() {

    this._showOverlay();

    var pos = this.getCenterPosition(this.popup);
    Element.setStyle(this.popup, { top: pos.y + "px", left: pos.x + "px" });
    new Effect.Appear(this.popup, { duration: this.options.show_duration });

    this.is_open = true;
  },
  
  closeModal: function() {
    new Effect.Fade(this.popup, { duration: this.options.hide_duration });
    this._hideOverlay();

    this.is_open = false;
  },
  
  showLoading: function() {
  },
  
  hideLoading: function() {
  },
  
  _showOverlay: function(bg_color) {
    if (!SB_Popup.overlay) {
      var overlay = document.createElement('div');
      overlay.setAttribute('id','SB_Popup_overlay');
      overlay.style.display = 'none';
      document.body.appendChild(overlay);
      SB_Popup.overlay = overlay;
    }
    
    SB_Popup.overlay.style.height = this.getPageDimensions().height + 'px';
    SB_Popup.overlay.style.backgroundColor = "#333";

    new Effect.Appear(SB_Popup.overlay, {
      duration: this.options.show_duration, 
      to: this.options.opacity,
      queue: { position: 'end', scope: 'SB_Popup_overlay' }}
    );
  },
  
  _hideOverlay: function() {
    new Effect.Fade(SB_Popup.overlay, { 
      duration: this.options.hide_duration,
      queue: { position: 'end', scope: 'SB_Popup_overlay'}}
    );
  }
  
});








