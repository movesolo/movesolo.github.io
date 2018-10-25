'use strict';
// Tested with Angular 1.3, 1.4.8
angular.module('scrollToEnd', [])
    /**
     * @ngdoc directive
     * @name scrollToEnd:scrollToEnd
     * @scope
     * @restrict A
     *
     * @description
     * Supply a handler to be called when this element is scrolled all the way to any extreme.
     * The callback must have the following signature:
     * void function (direction:'top'|'bottom'|'left'|'right')
     * If the `bindToWindow` attribute is truthy, the callback will be issued for the window
     * instead of the element that the directive is on.
     *
     * Example usage:
     * `<div scroll-to-end="scrollToEndWindow" bind-to-window="true">`
     * This will call the controller's `scrollToEndWindow` function whenever the window reaches
     * the edges when scrolling. If the div itself is a scrollable element for which the
     * handler should be called instead, remove the bind-to-window attribute entirely.
     *
     * @param {function}	emScrollToEnd   Callback to be invoked
     * @param {boolean}		bindToWindow		Bind to the window instead of the element
     *
     */
    .directive('scrollToEnd', function ($window) {
        // Get the specified element's computed style (height, padding, etc.) in integer form
        function getStyleInt(elem, prop) {
            try {
                return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop), 10);
            } catch (e) {
                return parseInt(elem.currentStyle[prop], 10);
            }
        }

        // Get the 'innerHeight' equivalent for a non-window element, including padding
        function getElementDimension(elem, prop) {
            switch (prop) {
                case 'width':
                    return getStyleInt(elem, 'width') +
                        getStyleInt(elem, 'padding-left') +
                        getStyleInt(elem, 'padding-right');
                case 'height':
                    return getStyleInt(elem, 'height') +
                        getStyleInt(elem, 'padding-top') +
                        getStyleInt(elem, 'padding-bottom');
                /*default:
                  return null;*/
            }
        }
        return {
            restrict: 'A',
            scope: {
                callback: '=scrollToEnd'
            },
            link: function (scope, elem, attr) {
                var callback = scope.callback || function () { };
                var boundToWindow = attr.bindToWindow;
                var body = document.body;
                var html = document.documentElement;
                var boundElement = boundToWindow ? angular.element($window) : elem;
                var oldScrollX = 0;
                var oldScrollY = 0;
                var handleScroll = function () {
                    // Dimensions of the content, including everything scrollable
                    var contentWidth;
                    var contentHeight;
                    // The dimensions of the container with the scrolling, only the visible part
                    var viewportWidth;
                    var viewportHeight;
                    // The offset of how much the user has scrolled
                    var scrollX;
                    var scrollY;

                    if (boundToWindow) {
                        // Window binding case - Populate Dimensions
                        contentWidth = Math.max(
                            body.scrollWidth,
                            body.offsetWidth,
                            html.clientWidth,
                            html.scrollWidth,
                            html.offsetWidth
                        );
                        contentHeight = Math.max(
                            body.scrollHeight,
                            body.offsetHeight,
                            html.clientHeight,
                            html.scrollHeight,
                            html.offsetHeight
                        );
                        viewportWidth = window.innerWidth;
                        viewportHeight = window.innerHeight;
                        scrollX = (window.pageXOffset || html.scrollLeft) - (html.clientLeft || 0);
                        scrollY = (window.pageYOffset || html.scrollTop) - (html.clientTop || 0);
                    } else {
                        // DOM element case - Populate Dimensions
                        var domElement = boundElement[0];
                        contentWidth = domElement.scrollWidth;
                        contentHeight = domElement.scrollHeight;
                        viewportWidth = getElementDimension(domElement, 'width');
                        viewportHeight = getElementDimension(domElement, 'height');
                        scrollX = domElement.scrollLeft;
                        scrollY = domElement.scrollTop;
                    }

                    var scrollWasInXDirection = oldScrollX !== scrollX;
                    var scrollWasInYDirection = oldScrollY !== scrollY;
                    oldScrollX = scrollX;
                    oldScrollY = scrollY;

                    if (scrollWasInYDirection && scrollY === 0) {
                        callback('top');
                    } else if (scrollWasInYDirection && scrollY === contentHeight - viewportHeight) {
                        callback('bottom');
                    } else if (scrollWasInXDirection && scrollX === 0) {
                        callback('left');
                    } else if (scrollWasInXDirection && scrollX === contentWidth - viewportWidth) {
                        callback('right');
                    }
                };
                boundElement.bind('scroll', handleScroll);
                // Unbind the event when scope is destroyed
                scope.$on('$destroy', function () {
                    boundElement.unbind('scroll', handleScroll);
                });
            }
        };
    });