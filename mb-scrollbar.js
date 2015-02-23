/*
 * mb-scrollbar v2.2.0
 * Plugin for AngularJS
 * (c) 2014 Matthew Balmer http://mattbalmer.com
 * License: MIT
 */
(function ( window, angular ) {

angular.module('mb-scrollbar', [])
.directive('mbScrollbar', function() {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            config: '=mbScrollbar'
        },
        template: "<div class='ngscroll-resizable' style='position: relative; width: 100%; height: 100%;'> <div class='ngscroll-container' style='width: 100%; height: 100%;' ng-transclude></div> <div class='ngscroll-scrollbar-container' ng-style='styles.scrollbarContainer'><div class='ngscroll-scrollbar' ng-style='styles.scrollbar'></div></div> </div>",
        link: function(scope, element) {

            // Helper functions
            function ifVertElseHor(vertical, horizontal) {
                return config.direction == 'horizontal' ? horizontal : vertical;
            }
            function overwriteProperties(baseObject, newObject) {
                for(var k in newObject) {
                    if( (newObject || {}).hasOwnProperty(k) && (baseObject || {}).hasOwnProperty(k) ) {
                        if( typeof baseObject[k] === 'object' ) {
                            baseObject[k] = overwriteProperties(baseObject[k], newObject[k]);
                        } else {
                            baseObject[k] = newObject[k];
                        }
                    }
                }
                return baseObject;
            }

            // Base Configuration
            var config = {
                autoResize: false,
                direction: (scope.config || {}).direction || 'vertical',
                scrollbar: {
                    width: 6,
                    hoverWidth: 8,
                    color: 'rgba(0,0,0,.6)',
                    show: false
                },
                scrollbarContainer: {
                    width: 12,
                    color: 'rgba(0,0,0,.1)'
                },
                dragSpeedModifier : 1,
                firefoxModifier: 40,
                scrollTo: (scope.config || {}).scrollTo || null
            };
            config.dimension = ifVertElseHor('height', 'width');
            config.rDimension = ifVertElseHor('width', 'height');
            config.position = ifVertElseHor('top', 'left');
            config.rPosition = ifVertElseHor('right', 'bottom');

            // Add user-input
            config = overwriteProperties(config, scope.config || {});

            // Computed configuration variables
            config.scrollbar.margin = (config.scrollbarContainer.width - config.scrollbar.width) / 2;
            config.scrollbar.hoverMargin = (config.scrollbarContainer.width - config.scrollbar.hoverWidth) / 2;

            // Elements
            var child = angular.element( element[0].querySelector('.ngscroll-container') ),
                scrollbarContainer = angular.element( element[0].querySelector('.ngscroll-scrollbar-container') ),
                scrollbar = angular.element( scrollbarContainer.children()[0] ),
                containerSize = 0,
                scrollbarLength,
                length = 0;

            // Set the initial css
            scope.styles = {
                scrollbar: {
                    position: 'absolute',
                    cursor: 'default',
                    opacity: config.scrollbar.show ? 1 : 0,
                    background: config.scrollbar.color,
                    'border-radius': config.scrollbar.width / 2 + 'px'
                },
                scrollbarContainer: {
                    position: 'absolute',
                    transition: 'background .3s ease-in-out',
                    'border-radius': config.scrollbarContainer.width / 2 + 'px'
                }
            };

            // Set calculated CSS
            scrollbar.css( config.rDimension , config.scrollbar.width+'px' );
            scrollbar.css( config.rPosition , config.scrollbar.margin +'px' );
            scrollbar.css( config.position , config.scrollbar.margin +'px' );
            scrollbarContainer.css( config.rPosition , '0' );
            scrollbarContainer.css( config.position , '0' );
            scrollbarContainer.css( config.dimension , '100%' );
            scrollbarContainer.css( config.rDimension , config.scrollbarContainer.width +'px' );

            // Reusable scroll function
            function scroll(distance) {
                var margin = 'margin-'+config.position;
                var newMargin = parseInt( child.css(margin) || 0 ) + distance;

                scrollTo(newMargin);
            }

            function scrollTo(position) {
                var margin = 'margin-'+config.position;
                var newMargin = Math.min( 0, Math.max( position, -length + containerSize ) );

                var pct = -newMargin / length;

                child.css(margin, newMargin + 'px');
                scrollbar.css(config.position, pct * containerSize + config.scrollbar.margin +'px');
                scrollbarContainer.css(margin, ifVertElseHor(-newMargin, 0) + 'px');
            }

            // Hiding/showing the scrollbar
            function hideScrollbar() {
                scrollbar.css('opacity', 0);
            }
            function showScrollbar() {
                scrollbar.css('opacity', 1);
            }

            // On item set change
            var recalculate = function() {
                ifVertElseHor(function() {
                    child.css('height', 'auto');
                    length = child[0].scrollHeight || 0;
                }, function() {
                    length = 0;

                    var children = child.children();

                    for(var i = 0; i < children.length; i++) {
                        length += children[i].offsetWidth;
                    }

                })();

                // Bug that the containerSize is not known at the initialisation of the script. After a recalculate it is known, update and use it.
                containerSize = ifVertElseHor( element[0].offsetHeight, element[0].offsetWidth);

                // A higher drag-speed modifier on longer container sizes makes for more comfortable scrolling
                config.dragSpeedModifier = Math.max(1, 1 / ( scrollbarLength / containerSize ));

                child.css(config.dimension, length+'px');

                // If scroll is not necessary, set the scrollbarLength to be containerSize (minus the margins)
                if(containerSize >= length) {
                    length = containerSize;
                    element.addClass('no-scrollbar');
                    element.removeClass('has-scrollbar');
                    hideScrollbar();
                } else {
                    element.addClass('has-scrollbar');
                    element.removeClass('no-scrollbar');
                    if(config.scrollbar.show)
                        showScrollbar();
                }

                scrollbarLength = ( containerSize / length ) * containerSize - config.scrollbar.margin * 2;
                scrollbar.css(config.dimension, scrollbarLength + 'px');
                scrollbar.css('transition', 'opacity .3s ease-in-out, border-radius .1s linear, ' +
                    config.rDimension+' .1s linear, ' +
                    config.rPosition+' .1s linear');

                // Scroll to the start, end, or a pixel value given in the config. If null, just stay there
                if (config.scrollTo == null)
                    scroll(0); // Moves the scroll area back into view if a resizing would have moved it out (eg. children removed)
                else if (config.scrollTo == 'start')
                    scrollTo(0);
                else if (config.scrollTo == 'end')
                    scrollTo( -length + containerSize );
                else
                    scrollTo( -parseInt(config.scrollTo) ); // Negative to account for the negative margin
            };

            // listen to DOM modification, IE11+, FF, Chrome, Safari
            // @added new MutationObserver
            if (typeof MutationObserver === 'function' ) {
                var observer = new MutationObserver(function (mutations) {
                    // delay recalculation, prevent recalculation before animation ends
                    setTimeout(function () { recalculate(); }, 200);
                });
                observer.observe(element[0], {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true
                });
            } else {
                // fallback compatibility
                if(config.autoResize === true) {
                    child.on('DOMNodeInserted', recalculate);
                    child.on('DOMNodeRemoved', recalculate);
                } 
            }

            // Listen to manual recalculate calls
            scope.$on('recalculateMBScrollbars', function(event) {
                setTimeout(function() {
                    recalculate();
                }, 5);
            });

            scope.$on('scrollToMBScrollbars', function (event, offset) {
                setTimeout(function () {
                    scrollTo(offset);
                }, 5);
            });

            // Move on scroll
            child.on('mousewheel', function(event) {
                event.preventDefault();

                // If jQuery hid the original event, retrieve it
                if( event.originalEvent != undefined )
                    event = event.originalEvent;

                var delta = ifVertElseHor(event.wheelDeltaY || event.wheelDelta, event.wheelDeltaX || event.wheelDeltaY || event.wheelDelta);

                scroll( delta );
            });
            if( window.navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
                child.on('wheel', function(event) {
                    event.preventDefault();

                    // If jQuery hid the original event, retrieve it
                    if( event.originalEvent != undefined )
                        event = event.originalEvent;

                    var delta = ifVertElseHor(event.deltaY, event.deltaX > 0 ? event.deltaX : event.deltaY);

                    scroll( - delta * config.firefoxModifier );
                    return false;
                });
            }

            // Scrollbar controls
            var scrollbarMousedown, scrollbarOffset;
            scrollbar.on('mousedown', function(event) {
                event.preventDefault();
                scrollbarMousedown = true;

                // Set mouseup listener
                angular.element(document).on('mouseup', function() {
                    scrollbarMousedown = false;
                    if(!config.scrollbar.show)
                        hideScrollbar();
                });

                scrollbarOffset = ifVertElseHor(event.screenY, event.screenX);
                return false;
            });
            angular.element(document).on('mousemove', function(event) {
                if(!scrollbarMousedown) return;
                event.preventDefault();

                var delta = ifVertElseHor(event.screenY, event.screenX) - scrollbarOffset;
                delta *= config.dragSpeedModifier;
                scrollbarOffset += delta * (scrollbarLength / containerSize);

                scroll( -delta );
            });

            // Show scrollbar on hover
            if(!config.scrollbar.show) {
                element.on('mouseenter', showScrollbar);
                scrollbarContainer.on('mouseenter', showScrollbar);
                element.on('mouseleave', function() {
                    if(scrollbarMousedown) return;
                    hideScrollbar();
                });
            }

            // On enter scrollbar container
            scrollbarContainer.on('mouseenter', function() {
                scrollbarContainer.css('background', config.scrollbarContainer.color);
                scrollbar.css( config.rDimension, config.scrollbar.hoverWidth+'px' );
                scrollbar.css( config.rPosition, config.scrollbar.hoverMargin +'px' );
                scrollbar.css( 'border-radius', config.scrollbar.hoverWidth / 2 + 'px' );
            });
            scrollbarContainer.on('mouseleave', function() {
                scrollbarContainer.css('background', 'none');
                scrollbar.css( config.rDimension, config.scrollbar.width + 'px' );
                scrollbar.css( config.rPosition, config.scrollbar.margin+'px' );
                scrollbar.css( 'border-radius', config.scrollbar.width / 2 +'px' );
            });

            // Initial calculate
            recalculate();
        }
    }
})
.service('mbScrollbar', function() {
    // Provide a method that wraps the broadcast in a timeout, which allows use inside Controllers
    this.recalculate = function($scope) {
        setTimeout(function() {
            $scope.$broadcast('recalculateMBScrollbars');
        }, 5);
    };
    this.scrollTo = function ($scope, event) {
         setTimeout(function() {
             $scope.$broadcast('scrollToMBScrollbars', event);
         }, 5);
    };
});
})( window, window.angular );
