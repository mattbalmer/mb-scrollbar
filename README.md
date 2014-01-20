ng-scrollbar
============

Custom scrollbar plugin for AngularJS

## Description

A small, unobtrusive plugin for AngularJS that allows placement of a custom scrollbar on any element. It will retain its size, but place any child elements into a scaling container div. The container's size can be set to automatically update, or can be called manually by broadcasting a 'recalculateScrollbars' event from your controller scope.

## Usage

Using the plugin is very easy - simply add the attribute `ng-scrollbar`, where the attribute's value is the config for the scrollbar. Example:

    <div class='roster' ng-scrollbar="scrollbarConfig">
      <div ng-repeat="person in roster"> {{person.name}} </div>
    </div>
  
The roster div will stay at whatever dimensions your CSS dictates, and anything inside will expand infinitely in whatever direction you specify in the config.

## Configuration

You should pass an object as the value of `ng-scrollbar`. Here is an example with all of the attributes you may set. Shown values are the default values.

    config = {
      autoResize: false, // If true, will listen for DOM elements being added or removed inside the scroll container
      direction: 'vertical', // The direction of the scrollbar
      scrollbar: {  
          width: 6, // Width (thickness. Is actually height on horizontal scrollbars) of the scrollbar
          hoverWidth: 8, // Width on scrollbar hover
          color: 'rgba(0,0,0, .6) // Background color of the scrollbar
      },
      scrollbarContainer: {
          width: 12, // Width of the container surrounding the scrollbar. Becomes visible on hover
          color: 'rgba(0,0,0, .1) // Background color of the scrollbar container
      }
    }
    
## Compatibility

The plugin has not yet been rigorously tested, but should work in all modern browsers, and in IE9+
    
## Contact & License Info

Author: Matthew Balmer  
Twitter: [@mattbalmer](http://twitter.com/mattbalmer)
Website: [http://mattbalmer.com](http://mattbalmer.com)
License: MIT
