'use strict'

angular
  .module('Igor')
  .factory('Auth.Service', AuthService)

function AuthService($rootScope, $state, $firebaseAuth, $log) {
  const vm = this

  function logout() {
    $log.debug('AuthService:logout')
    $state.go('login')
  }

  function login(user) {
    $log.debug('AuthService:login')
  }

  function register(user) {
    $log.debug('AuthService:register')
  }
}

