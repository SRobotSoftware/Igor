'use strict'

angular
  .module('Igor')
  .factory('AuthService', AuthService)

function AuthService($rootScope, $state, $log, $mdToast, $firebaseAuth) {
  const vm = this
  const auth = $firebaseAuth()
  vm.login = login
  vm.logout = logout
  vm.register = register
  vm.forgot = forgot
  vm.getUser = getUser
  let account = null

  function errorToast(err, message) {
    return $mdToast.simple()
      .textContent(`Error: ${err} | ${message}`)
      .position('top right')
      .hideDelay(10000)
  }

  function successToast(message) {
    return $mdToast.simple()
      .textContent(`Success: ${message}`)
      .position('top right')
      .hideDelay(3000)
  }

  function logout() {
    $log.debug('AuthService:logout')
    setUser(null)
    $state.go('login')
  }

  function login(user) {
    $log.debug('AuthService:login')
    auth.$signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        $mdToast.show(successToast('Logged In'))
        $log.debug('AuthService: User Logged In:', res)
        setUser(res)
        $state.go('dashboard')
      })
      .catch(err => {
        $mdToast.show(errorToast(err.code, err.message))
        $log.debug('AuthService: Error during login:', err)
      })
  }

  function register(user) {
    $log.debug('AuthService:register')
    auth.$createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        $mdToast.show(successToast('User Created'))
        $log.debug('AuthService: User created:', res)
        setUser(res)
        $state.go('dashboard')
      })
      .catch(err => {
        $mdToast.show(errorToast(err.code, err.message))
        $log.debug('AuthService: Error during registration:', err)
      })
  }

  function forgot(user) {
    $log.debug('AuthService:forgot')
    $mdToast.show(errorToast('Not Implemented yet'))
  }

  function setUser(user) {
    account = user
  }

  function getUser() {
    return account
  }
  return vm
}

