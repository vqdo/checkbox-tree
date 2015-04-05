/*
 * y
 * https://github.com/vqdo/checkbox-tree
 *
 * Copyright (c) 2015 Victoria Do
 * Licensed under the MIT license.s
 */

(function($) {

  var pluginName = 'checkboxtree',
      htmlPrefix = 'cbt-',
      listClass = htmlPrefix + 'list',
      expandClass = htmlPrefix + 'expand',
      defaults = {
        data: {}
      }; 

  function CBTree( element, options ) {
    this.element = element;

    this.options = $.extend( {}, defaults, options) ;
    
    this._defaults = defaults;
    this._name = pluginName;
    
    this.init();
  }

  CBTree.prototype.init = function() {
    this._addSublist(this.options.data, this.element);
    this._update();
  };

  var updateUI = function(items, recurse) {
    if(!items) {
      return;
    }

    $.each(items, function(i, item) {
      var html = item._htmlNode;
      $(html).find('.' + listClass).toggle(item._expanded);
      $(html).toggleClass('expanded', item._expanded);
    
      if(recurse) {
        updateUI(item.children);
      }

    });
  };

  CBTree.prototype._update = function(data) {
    console.log("Update called");

    if (data) { 
      updateUI(data);
    } else {
      updateUI(this.options.data, true);
    }

  };

  CBTree.prototype._initExpandable = function(info, parent) {
    var $expandButton = $('<span />')
          .addClass(expandClass);

    $expandButton.click($.proxy(function() {
      console.log(info._expanded);
      info._expanded = !info._expanded;
      this._update([info]);
    }, this));

    if(!info.children) {
      $expandButton.attr('disabled', true);
    }

    parent.append($expandButton);
  };

  // Collection method.
  $.fn[pluginName] = function( data ) {
    return this.each(function() {

        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, 
          new CBTree( this, data ));
        }
    });
  };

  CBTree.prototype._addSublist = function(list, parent) {
    if(!parent) {
      return;
    }

    var wrapper   = $('<ul />').addClass(htmlPrefix + 'list');
    var self = this;

    if($.isArray(list)) {

      $.each(list, function(i, item) {
        self._addItem(item, wrapper);
      });

    }

    $(parent).append(wrapper);
  };

  CBTree.prototype._addItem = function(info, parent) {
    if(!info || !parent) {
      return;
    }
    
    console.log(info);
    var item = $('<li />').addClass(htmlPrefix + 'item');
    this._initExpandable(info, item);

    if(info) {
      this._addCheckbox(info, item);      

      if(info.children) {
        this._addSublist(info.children, item);
      }
    }

    $(parent).append(item);
  };

  CBTree.prototype._addCheckbox = function(options, container) {
      //console.log("Options");
      //console.log(options);
      var checkbox  = $('<input type="checkbox" />'),
          label     = $('<label />'),
          cbname    = htmlPrefix + options.name;

      // Checkbox details
      checkbox
        .attr('name', cbname)
        .attr('checked', options.selected);

      // Label details
      label
        .attr('for', cbname)
        .html(options.name);    

      // Add private, stateful fields
      options._expanded = !!options.selected;
      options._htmlNode = container; 


      container.append(checkbox).append(label);        
  };


}(jQuery));
