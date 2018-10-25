app.controller('AccountController', ['$scope', '$location', 'Auth', '$http', '$rootScope', '$routeParams', 'metaTag',
    function ($scope, $location, Auth, $http, $rootScope, $routeParams, metaTag) {

        $scope.params = $routeParams.logstatus;

        switch ($scope.params) {
            case 'login':
                $scope.login = true;
                $scope.meta = 'Login';
                break;
            case 'register':
                $scope.register = true;
                $scope.meta = 'Register';
                break;
            case 'reset':
                $scope.reset = true;
                $scope.meta = 'Reset Password';
                break;
            default:
                $scope.login = true;
                $scope.meta = 'Login';
        }

        $rootScope.metaservice = metaTag;
        $rootScope.metaservice.set("Movesolo | " + $scope.meta , "Home", "Home");

      

        $scope.loginSubmit = function () {
            if ($scope.login) {
                Auth.$signInWithEmailAndPassword($scope.email, $scope.password)
                    .then(function (firebaseUser) {
                        $scope.loginSuccess();
                    }).catch(function (error) {
                        $scope.loginError();
                    });
            };
        }

        $scope.registerSubmit = function () {
            if ($scope.register) {
                $scope.userName = $scope.name;
                Auth.$createUserWithEmailAndPassword($scope.email, $scope.password).then(function (firebaseUser) {
                    firebaseUser.updateProfile({
                        displayName: $scope.name,
                        userName: 'daniel'
                    })
                    $scope.loginSuccess();
                }).catch(function (error) {
                    $scope.loginError();
                });
            };
        };

        $scope.GoogleAuth = function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            Auth.$signInWithRedirect(provider).then(function (result) {
                $scope.loginSuccess();
            }).catch(function (error) {
                $scope.loginError();
            });
        };


        $scope.loadEnd();

    }
]);