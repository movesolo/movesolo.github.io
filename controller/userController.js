app.controller('UserController', ['$scope', '$http', '$rootScope', '$routeParams', 'metaTag',
    function ($scope, $http, $rootScope, $routeParams, metaTag) {
        //http://jsfiddle.net/PZ567/
        $rootScope.metaservice = metaTag;
        $rootScope.metaservice.set("Movesolo | Home", "Home", "Home");

        $scope.params = $routeParams.username; 

        console.log($scope.params);

        //switch ($scope.params) {
        //    case 'Home':
        //        window.location = "index.html#!/Home";
        //      //  $scope.type = 'now_playing';
        //        break;
        //    case 'Popular':
        //        $scope.type = 'popular';
        //        break;
        //    case 'TopRated':
        //        $scope.type = 'top_rated';
        //        break;
        //    default:
        //        $scope.type = 'popular';
        //}

        $scope.loadEnd();

    }
]);