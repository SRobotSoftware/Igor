/* global Firebase */
angular
	.module('Disco')
	.controller('LoginController', LoginController)

function LoginController($rootScope, $scope, $state, AuthService) {

		$scope.login = AuthService.login;

		$scope.register = AuthService.register;

		if ($rootScope.authData) {
		$state.go('dashboard');
		}

};