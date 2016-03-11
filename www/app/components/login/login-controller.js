/* global Firebase */
angular
	.module('Disco')
	.controller('LoginController', LoginController);

function LoginController($rootScope, $scope, $state, AuthService) {
	var vm = this;
	this.login = AuthService.login;

	this.register = AuthService.register;

	if ($rootScope.authData) {
		$state.go('dashboard');
	}

}