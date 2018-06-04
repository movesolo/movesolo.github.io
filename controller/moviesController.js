app.controller('MoviesController', ['$scope', '$http', '$rootScope', '$routeParams', 'metaTag',
    function ($scope, $http, $rootScope, $routeParams, metaTag) {

        $scope.params = $routeParams.moviescategory;

        switch ($scope.params) {
            case 'latest':
                $scope.type = 'now_playing';
                $scope.meta = 'Latest';
                break;
            case 'popular':
                $scope.type = 'popular';
                $scope.meta = 'Popular';
                break;
            case 'toprated':
                $scope.type = 'top_rated';
                $scope.meta = 'Top Rated';
                break;
            default:
                $scope.type = 'popular';
                $scope.meta = 'Popular';
        }

        $rootScope.metaservice = metaTag;
        $rootScope.metaservice.set("Movesolo | " + $scope.meta, "Home", "Home");

        $scope.page = 0;
        $scope.movies = [];

        //$scope.sortlist = {
        //    available: [
        //        { id: '1', name: 'now_playing', header: 'Now Playing' },
        //        { id: '2', name: 'popular', header: 'Popular' },
        //        { id: '3', name: 'top_rated', header: 'Top Rated' },
        //        { id: '4', name: 'upcoming', header: 'Upcoming' }
        //    ], selected: { id: '1', name: 'now_playing', header: 'Now Playing' }
        //}

        //$scope.type = $scope.sortlist.selected.name;

        $scope.update = function () {
            $scope.page = 0;
            $scope.movies = [];
            $scope.init();
        }

        

        $scope.init = function () {
            $scope.loading = true;
            $scope.page = $scope.page + 1
            $http({
                method: 'GET',
                url: 'https://api.themoviedb.org/3/movie/' + $scope.type + '?api_key=4b31e1892fbd7228348ccd03ed7878e5&language=en-US&page=' + $scope.page
            }).then(function (response) {
                for (var i = 0; i < response.data.results.length; i++) {
                    $scope.movies.push(response.data.results[i])
                }
                $scope.loading = false;
                $scope.loadEnd();
            });
        }

        $scope.scroll = function (data) {
            if (data === 'bottom') {
                $scope.init();	 //	window.onscroll
            }
        }

        $scope.init();	 //	window.onload
     
    }
]);