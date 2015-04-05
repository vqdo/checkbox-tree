/*
 * Checkbox Tree
 * https://github.com/vqdo/checkbox-tree
 *
 * Copyright (c) 2015 Victoria Do
 * Licensed under the MIT license.
 */

(function($) {

  var pluginName = 'checkboxtree',
      htmlPrefix = 'cbt-',
      listClass = htmlPrefix + 'list',

      // Class names
      expandClass = htmlPrefix + 'expand',
      checkedStateNone = htmlPrefix + 'sublist-checked-none',
      checkedStatePartial = htmlPrefix + 'sublist-checked-partial',
      checkedStateAll = htmlPrefix + 'sublist-checked-all',

      // Default options for plugin
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

  /***************************************************
   * Initializes creation of the checkbox tree
   **************************************************/
  CBTree.prototype.init = function() {
    this._addSublist(this.options.data, this.element);
    this._update();
  };

  /***************************************************
   * Updates the checkbox tree UI 
   **************************************************/
  CBTree.prototype._update = function(data) {
    console.log("Update called");

    if (data) { 
      updateUI(data);
    } else {
      updateUI(this.options.data, true);
    }

  };

  /** Private helper methods for _update
   *****************************************************/
      var updateUI = function(items, recurse) {
        if(!items) {
          return;
        }

        $.each(items, function(i, item) {
          var html = item._htmlNode;   
          $(html).children('.' + listClass).toggle(item._expanded);
          $(html).toggleClass('expanded', item._expanded);

          updateCheckedUI(item);
        
          if(recurse) {
            updateUI(item.children, true);
          }

        });
      };

      // data - list item
      var updateCheckedUI = function(data) {
        if(!data || !data._htmlNode) {
          return;
        }

        var html = data._htmlNode; 
        var $ul = $(html).children('ul');

        var numChecked = $($ul).find('> .cbt-item > .cbt-cb:checked').length;

        html.removeClass(checkedStatePartial + ' ' + checkedStateAll + ' ' + checkedStateNone);
        if(numChecked <= 0) {
          html.addClass(checkedStateNone);
        } else if(numChecked < $ul.children().length) {
          html.addClass(checkedStatePartial);
        } else {
          html.addClass(checkedStateAll);
        }
      };

  // Collection method.
  $.fn[pluginName] = function( data ) {

    $.fn[pluginName].getItems = function() {
      return (data && data.data) || {};
    };

    return this.each(function() {

        if (!$.data(this, 'plugin_' + pluginName)) {
          
          var tree = new CBTree( this, data );
          $.data(this, 'plugin_' + pluginName, tree);

          $(this).data('tree', tree);
        }
    });
  };

  /***************************************************
   * Creates an unordered list to hold checkbox items
   **************************************************/
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

  /********************************************************
   * Creates a single checkbox item with expandable button
   * and any sublists
   ********************************************************/
  CBTree.prototype._addItem = function(info, parent) {
    if(!info || !parent) {
      return;
    }
    
    var item = $('<li />').addClass(htmlPrefix + 'item');
    this._initExpandable(info, item);

    if(info) {
      this._addCheckbox(info, item);      

      if(info.children && info.children.length) {
        this._addSublist(info.children, item);

        var $sublistNode = $(item).children('ul');
        $(item).on('change', $sublistNode, function() {
          updateCheckedUI(info);
        });

      }
    }

    $(parent).append(item);
  };

  /** 
   * Creates a checkbox and label.
   * 
   * args:
   *    - options: object containing checkbox attributes
   *    - container: the html node that wraps the checkbox
   */
  CBTree.prototype._addCheckbox = function(options, container) {

      var $checkbox  = $('<input type="checkbox" />'),
          $label     = $('<label />'),
          cbName    = htmlPrefix + options.name,
          cbClass   = htmlPrefix + 'cb';

      // Checkbox details
      $checkbox
        .attr('name', cbName)
        .attr('checked', options.selected)
        .addClass(cbClass);

      // Label details
      $label
        .attr('for', cbName)
        .html(options.name);    

      // Add private and public fields
      options.children  = options.children || [];
      options.selected  = !!options.selected; // Set selected field explicityly
      options._expanded = !!options.selected;
      options._htmlNode = container; 

      container.append($checkbox).append($label);        
  };

  /***************************************************
   * Initializes the expandable state of the current 
   * checkbox item
   **************************************************/
  CBTree.prototype._initExpandable = function(info, parent) {
    var $expandButton = $('<span />')
          .addClass(expandClass);

    $expandButton.click($.proxy(function() {
      info._expanded = !info._expanded;
      this._update([info]);
    }, this));

    if(!info.children || !info.children.length) {
      $expandButton.attr('disabled', true);
    } 

    parent.append($expandButton);
  };  


}(jQuery));
