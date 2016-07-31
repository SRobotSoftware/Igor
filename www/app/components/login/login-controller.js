/* global Firebase */
'use strict'

angular
  .module('Igor')
  .controller('LoginController', LoginController)

function LoginController($rootScope, $scope, $state, AuthService) {
  const vm = this
  vm.login = AuthService.login
  vm.register = AuthService.register

  if ($rootScope.authData) {
    // $state.go('dashboard');
    AuthService.logout()
  }
}
