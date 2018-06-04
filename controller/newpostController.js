app.controller('NewPostController', ['$scope', '$http', '$rootScope', '$timeout', '$firebaseArray', 'metaTag', 'Auth',
    function ($scope, $http, $rootScope, $timeout, $firebaseArray, metaTag, Auth) {

        $rootScope.metaservice = metaTag;
        $rootScope.metaservice.set("Movesolo | My Post", "Post", "Post");

        var newPostKey, postsRef, userPostsRef;
        var authorId = localStorage.getItem('movesolo-uid');

        $scope.selectedProject = function (selected) {
            if (selected) {
                $scope.MovieId = selected.originalObject.id;
                $scope.MovieTitle = selected.originalObject.title;
                $scope.MoviePosterPath = selected.originalObject.poster_path;
                $scope.MovieBackdropPath = selected.originalObject.backdrop_path;
                $scope.MovieOriginalTitle = selected.originalObject.original_title;
                $scope.MovieOverview = selected.originalObject.overview;
                $scope.MovieGenre = selected.originalObject.genre_ids;
                $scope.MovieReleaseDate = selected.originalObject.release_date;
                $scope.MovieRating = selected.originalObject.vote_average;
            } else {
                console.log('cleared');
            }
        };

        

        $scope.submitPost = function () {

            console.log($scope.confirmValue);
            console.log($scope.confirmValue1);

            var authData = Auth.$getAuth();

            // Get a key for a new Post.
            newPostKey = firebase.database().ref('public-posts').push().key;

            publicPostsRef = firebase.database().ref("public-posts/" + newPostKey)
            userPostsRef = firebase.database().ref("user-posts/" + authData.uid + "/" + newPostKey);

            if (authData) {
                var updates = {};
                var postData = {
                    userId: authData.uid,
                    userName: authData.displayName,
                    userEmail: authData.email,
                    userPicture: authData.photoURL,
                    movieInfo: {
                        id: $scope.MovieId,
                        title: $scope.MovieTitle,
                        poster_path: $scope.MoviePosterPath,
                        backdrop_path: $scope.MovieBackdropPath,
                        original_title: $scope.MovieOriginalTitle,
                        overview: $scope.MovieOverview,
                        genre_ids: $scope.MovieGenre,
                        release_date: $scope.MovieReleaseDate,
                        vote_average: $scope.MovieRating
                    },
                    viewCount: 0,
                    upCount: 0,
                    downCount: 0,
                    createdDate: firebase.database.ServerValue.TIMESTAMP
                };
                updates['/public-posts/' + newPostKey] = postData;
                updates['/user-posts/' + authData.uid + '/' + newPostKey] = postData;
                return firebase.database().ref().update(updates);
            } else {
                console.log("Log in first");
            }

        };


        if (authorId != null || authorId != '' || authorId != 'undefined') {

            var ref = firebase.database().ref("user-posts/" + authorId).limitToLast(10);

            $scope.loading = true;

            $firebaseArray(ref).$loaded().then(function () {
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

            //show more functionality
            var pagesShown = 1;
            var pageSize = 10;

            $scope.paginationLimit = function (data) {
                return pageSize * pagesShown;
            };

            $scope.hasMoreItemsToShow = function () {
                return pagesShown < ($scope.posts.length / pageSize);
            };

            $scope.showMoreItems = function () {
                pagesShown = pagesShown + 1;
            };

        } else { console.log("login first"); }

        // Bind starring action.
        $scope.count = function (postId, count) {
            var globalPostRef = firebase.database().ref('public-posts/' + postId);
            var userPostRef = firebase.database().ref('/user-posts/' + authorId + '/' + postId);
            if (count === 'upCount') {
                $scope.upCount(globalPostRef, authorId);
                $scope.upCount(userPostRef, authorId);
            } else if (count === 'downCount') {
                $scope.downCount(globalPostRef, authorId);
                $scope.downCount(userPostRef, authorId);
            } else {
                console.log("login first");
            }
        };

        // Bind starring action.
        $scope.link = function (postId) {
            var globalPostRef = firebase.database().ref('public-posts/' + postId);
            var userPostRef = firebase.database().ref('/user-posts/' + authorId + '/' + postId);
            $scope.viewCount(globalPostRef);
            $scope.viewCount(userPostRef);
        };

        $scope.loadEnd();
    }
]);
