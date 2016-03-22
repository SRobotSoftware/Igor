/* global Firebase */
angular
	.module('Disco')
	.controller('LoginController', LoginController);

function LoginController($rootScope, $scope, $state, AuthService) {
	var vm = this;
	vm.login = AuthService.login;
	vm.register = AuthService.register;

	if ($rootScope.authData) {
		// $state.go('dashboard');
		AuthService.logout();
	}

}