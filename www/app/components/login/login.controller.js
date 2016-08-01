'use strict'

angular
  .module('Igor')
  .controller('Login.Controller', loginController)

function loginController($log, $state) {
  $log.debug('Login.Controller initialized')
  const vm = this
  vm.login = login
  vm.register = register
  vm.forgot = forgot

  function login() {
    $log.debug('login.controller:login')
    $state.go('dashboard')
  }

  function register() {
    $log.debug('login.controller:register')
  }

  function forgot() {
    $log.debug('login.controller:forgot')
  }
}
