'use strict'

angular
  .module('Igor')
  .controller('Login.Controller', loginController)

function loginController($log, $state, AuthService) {
  $log.debug('Login.Controller initialized')
  const vm = this
  vm.login = login
  vm.register = register
  vm.forgot = forgot

  function login() {
    $log.debug('login.controller:login')
    AuthService.login(vm.user)
    // $state.go('dashboard')
  }

  function register() {
    $log.debug('login.controller:register')
    AuthService.register(vm.user)
  }

  function forgot() {
    $log.debug('login.controller:forgot')
    AuthService.forgot(vm.user)
  }
}
