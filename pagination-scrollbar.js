/*
 * mb-scrollbar v2.2.0
 * Plugin for AngularJS
 * (c) 2014 Matthew Balmer http://mattbalmer.com
 * License: MIT
 */
angular.module('pagination', [])
    .directive('pagination', function() {
        return {
            require: '^?mb-scrollbar',

            link: {
                post: function(scope, element, attrs){

                    var _monitorElement = element[0].querySelector('.ngscroll-container'),
                        _scrollHeight = _monitorElement.scrollHeight,
                        _offsetHeight = _monitorElement.offsetHeight;
                    var child = angular.element(_monitorElement);

                    var observer = new MutationObserver(function (mutations) {

                        var _currentMarginTop = Math.abs(parseInt(child.css('margin-top')));
                        _scrollHeight = _monitorElement.scrollHeight;

                         if((_scrollHeight-_offsetHeight) === _currentMarginTop && _currentMarginTop !== 0 && observer.isNotScrollDown){
                            console.log('It is down haha');
                            observer.isNotScrollDown = false;
                            scope.$apply(attrs.pagination);

                         }else if((_scrollHeight-_offsetHeight) !== _currentMarginTop){
                            observer.isNotScrollDown = true;
                         }

                    });
                    observer.observe(_monitorElement, {
                        attributes: true,
                        attributeOldValue: true,
                        attributeFilter: ['style']
                    });
                    observer.isNotScrollDown = true;
                }
            }

        }
    });

