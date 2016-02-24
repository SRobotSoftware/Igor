/* global Firebase */
app.controller('LoginController', function ($rootScope, $scope, $state, DSFirebaseAdapter, User) {

    $scope.login = function (user) {
        DSFirebaseAdapter.ref.authWithPassword(user, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $rootScope.authData = authData;
            }
        });
    };

    $scope.register = function () {
// 
    };

    function clearErr() {
        $scope.authErr = '';
    }

    function handleDBResponse(err) {
        if (err) {
            $scope.authErr = err.message;
            $scope.$apply();
        } else {
            $state.go('dashboard');
        }
    }
    
    $scope.getStuff = function () {
        debugger;
        User.find('5a0a48ed-533e-4cf8-a245-a47ddaec905c')
            .then(function (data) {
                debugger;
            });
        
    };
    
});