app.controller('BoxController', ['$scope', '$http', '$rootScope', '$firebaseArray', 'metaTag', 'Auth',
    function ($scope, $http, $rootScope, $firebaseArray, metaTag, Auth) {

        $rootScope.metaservice = metaTag;
        $rootScope.metaservice.set("Movesolo | My Box", "Post", "Post");

        var userWatchListRef;

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

            var authData = Auth.$getAuth();

            userWatchListRef = firebase.database().ref("user-watchlist/" + authData.uid);

            userWatchListRef.once("value").then(function (snapshot) {

                var dupCheck = true;

                snapshot.forEach(function (childSnapshot) {
                    if (snapshot.child(childSnapshot.key + "/movieInfo/id").val() === $scope.MovieId) {
                        dupCheck = false;
                    }
                });

                if (authData && dupCheck === true) {

                    $scope.postData = {
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
                        createdDate: firebase.database.ServerValue.TIMESTAMP
                    };

                    $firebaseArray(userWatchListRef).$add($scope.postData);

                } else if (dupCheck === false) {

                    console.log("already exist");

                } else {

                    console.log("Log in first");

                }

            });


           



        };


        if (localStorage.getItem('movesolo-uid') != null || localStorage.getItem('movesolo-uid') != '' || localStorage.getItem('movesolo-uid') != 'undefined') {

            var ref = firebase.database().ref("user-watchlist/" + localStorage.getItem('movesolo-uid')).limitToLast(20);

            $scope.loading = true;

            $firebaseArray(ref).$loaded().then(function () {
                $scope.loading = false;
            });

            $scope.posts = $firebaseArray(ref);

        } else { console.log("Log in first"); }

        $scope.loadEnd();
    }
]);
