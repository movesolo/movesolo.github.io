app.controller('HomeController', ['$scope','$window', '$http', '$timeout', '$firebaseArray', '$rootScope', 'metaTag', 'Auth',
    function ($scope, $window, $http, $timeout, $firebaseArray, $rootScope, metaTag, Auth) {

        $rootScope.metaservice = metaTag;
        $rootScope.metaservice.set("Movesolo | Home", "Home", "Home");

        $scope.loading = true;

        var now = firebase.database.ServerValue.TIMESTAMP;
        var ref = firebase.database().ref("public-posts").limitToLast(100);
        var authorId = localStorage.getItem('movesolo-uid');
        //$firebaseArray(ref).$loaded().then(function () {
        //    $scope.loading = false;
        //});

        ref.once('value', function () {
            $scope.loading = false;
        });

        $scope.posts = $firebaseArray(ref);

        $scope.scroll = function (data) {
            if (data === 'bottom') {
                $timeout(function () {
                    var element = document.getElementById('showMoreItems');
                    angular.element(element).triggerHandler('click');
                }, 0);
            }
        }

        // Bind starring action.
        $scope.count = function (postId, count) {
            var globalPostRef = firebase.database().ref('public-posts/' + postId);
            var postAuthId;
            globalPostRef.once('value', function (snapshot) {
                postAuthId = snapshot.val().userId;
            });
            var userPostRef = firebase.database().ref('/user-posts/' + postAuthId + '/' + postId);
            if (count == 'view') {
                $scope.viewCount(globalPostRef);
            //    $scope.viewCount(userPostRef);
           //     $window.open("somepath/", "_blank")
            } else if (count == 'up') {
                $scope.upCount(globalPostRef, authorId);
           //     $scope.upCount(userPostRef, authorId);
            } else if (count == 'down') {
                $scope.downCount(globalPostRef, authorId);
         //       $scope.downCount(userPostRef, authorId);
            } else {

            }
        };

        //show more functionality
        var pagesShown = 1;
        var pageSize = 15;

        $scope.paginationLimit = function (data) {
            return pageSize * pagesShown;
        };

        $scope.hasMoreItemsToShow = function () {
            return pagesShown < ($scope.posts.length / pageSize);
        };

        $scope.showMoreItems = function () {
            pagesShown = pagesShown + 1;
        };

        $scope.loadEnd();

    }
]);