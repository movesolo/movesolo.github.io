app.controller('MainController', ['$scope', '$location', 'Auth',
    function ($scope, $location, Auth) {

        Auth.$onAuthStateChanged(function (authData) {
            if (authData) {
                console.log(authData.displayName)
                localStorage.setItem('movesolo-uid', authData.uid);
                console.log("Logged in as:", authData.uid);
            } else {
                localStorage.setItem('movesolo-uid', null);
                console.log("Logged out");
            }
        });

        $scope.viewlist = {
            available: [
                { id: '1', name: 'List', header: 'List' },
                { id: '2', name: 'm-col-sm', header: 'Tiles' },
                { id: '3', name: 'm-col-md', header: 'Content' }
            ], selected: { id: '2', name: 'm-col-sm', header: 'Tiles' }
        }

        $scope.view = $scope.viewlist.selected.name;

        $scope.list = function () {
            $scope.view = $scope.viewlist.selected.name;
        }

        $scope.remoteUrlRequestFn = function (str) {
            var key = '4b31e1892fbd7228348ccd03ed7878e5';
            return {
                query: str,
                api_key: key
            };
        };

        $scope.PageBody = angular.element(document.querySelector('body'));
        if (localStorage.getItem('app-login') == 'true') { $scope.PageBody.addClass('logged'); }
        else { $scope.PageBody.removeClass('logged'); }

        $scope.loginSuccess = function () {
            $scope.PageBody.addClass('logged');
            localStorage.setItem('app-login', true);
            $location.path('/home');
        };

        $scope.loginError = function () {
            $scope.PageBody.removeClass('logged');
            localStorage.setItem('app-login', false);
            //$location.path('/Home');
        };

        $scope.loadEnd = function () {
            $scope.PageBody.removeClass('hide');
        };









        // [START post_stars_transaction]
        $scope.upCount = function(postRef, uid) {
            postRef.transaction(function (post) {
                if (post) {
                    if (post.upCounts && post.upCounts[uid]) {
                        post.upCount--;
                        post.upCounts[uid] = null;
                    } else {
                        post.upCount++;
                        if (!post.upCounts) {
                            post.upCounts = {};
                        }
                        post.upCounts[uid] = true;
                    }
                }
                return post;
            });
        }

        $scope.downCount = function(postRef, uid) {
            postRef.transaction(function (post) {
                if (post) {
                    if (post.downCounts && post.downCounts[uid]) {
                        post.downCount--;
                        post.downCounts[uid] = null;
                    } else {
                        post.downCount++;
                        if (!post.downCounts) {
                            post.downCounts = {};
                        }
                        post.downCounts[uid] = true;
                    }
                }
                return post;
            });
        }

        // [START post_stars_transaction]
        $scope.viewCount = function(postRef) {
            postRef.transaction(function (post) {
                if (post) {
                    post.viewCount++;
                }
                return post;
            });
        }






    }
]);