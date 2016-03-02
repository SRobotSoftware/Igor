/* global Firebase */
app.controller('LoginController', function ($rootScope, $scope, AuthService) {

	$scope.login = AuthService.login;

	$scope.register = AuthService.register;

});