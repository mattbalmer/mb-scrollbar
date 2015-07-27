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
                        _child = angular.element(_monitorElement),
                        _isHorizontal = attrs.mbScrollbar.indexOf('horizontal') >= 0,
                        _position = 'margin-top';

                    var _scrollSize = _monitorElement.scrollHeight,
                        _offsetSize = _monitorElement.offsetHeight;

                    if(_isHorizontal){
                        _scrollSize = _monitorElement.scrollWidth,
                        _offsetSize = _monitorElement.offsetWidth;
                        _position = 'margin-left';
                    }

                    var observer = new MutationObserver(function (mutations) {

                        var _currentMarginValue = Math.abs(parseInt(_child.css(_position)));
                        _scrollSize = _isHorizontal ? _monitorElement.scrollWidth : _monitorElement.scrollHeight;

                        if((_scrollSize-_offsetSize) === _currentMarginValue && _currentMarginValue !== 0 && observer.isNotScrollDown){
                            observer.isNotScrollDown = false;
                            scope.$apply(attrs.pagination);
                        }else if((_scrollSize-_offsetSize) !== _currentMarginValue){
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

