app.directive("stickyNav", function stickyNav($window) {
	function stickyNavLink(scope, element) {
		var win = angular.element($window),
			size = element[0].clientHeight,
			top = 0;
		function toggleStickyNav() {
			if (!element.hasClass('controls-fixed') && $window.pageYOffset > top + size) {
				element.addClass('controls-fixed');
			} else if (element.hasClass('controls-fixed') && $window.pageYOffset <= top + size) {
				element.removeClass('controls-fixed');
			}
		}
		scope.$watch(function () {
			return element[0].getBoundingClientRect().top + $window.pageYOffset;
		}, function (newValue, oldValue) {
			if (newValue !== oldValue && !element.hasClass('controls-fixed')) {
				top = newValue;
			}
		});
		win.bind('resize', function stickyNavResize() {
			element.removeClass('controls-fixed');
			top = element[0].getBoundingClientRect().top + $window.pageYOffset;
			toggleStickyNav();
		});
		win.bind('scroll', toggleStickyNav);
	}
	return {
		scope: {},
		restrict: 'A',
		link: stickyNavLink
	};
});