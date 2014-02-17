mb-scrollbar
============

Custom scrollbar plugin for AngularJS

## Description

A small, unobtrusive plugin for AngularJS that allows placement of a custom scrollbar on any element. It will retain its size, but place any child elements into a scaling container div. The container's size can be set to automatically update, or can be called manually by broadcasting a 'recalculateMBScrollbars' event from your controller scope.

## Usage

Using the plugin is very easy - simply add the attribute `mb-scrollbar`, where the attribute's value is the config for the scrollbar. Example:

    <div class='roster' mb-scrollbar="scrollbarConfig">
      <div ng-repeat="person in roster"> {{person.name}} </div>
    </div>
  
The roster div will stay at whatever dimensions your CSS dictates, and anything inside will expand infinitely in whatever direction you specify in the config.

Also don't forget to include the module in your own Angular app

    var app = angular.module('YourApp', ['mb-scrollbar']);

### Resizing

One option to recalculate the size of the container is to set the `autoResize` config option to `true`. When the plugin detects a child element has been added/removed, it will automatically recalculate.

This option is not always ideal, and in some older browsers, may not work as expected. Another option, to call the recalculate function manually. A small Service is provided to make this easy, though the `recalculateMBScrollbars` event may also be broadcast, if you prefer.

    // Option 1
    $scope.$broadcast('recalculateMBScrollbars');

    // Option 2 - This option is preferred of the two. It wraps the call in a short timeout,
    // which allows the scope to compile first. It also requires the 'mbScrollbar' Service to be injected
    mbScrollbar.recalculate();

## Configuration

You should pass an object as the value of `mb-scrollbar`. Here is an example with all of the attributes you may set. Shown values are the default values.

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
