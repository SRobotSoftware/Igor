'use strict'

angular
  .module('Igor')
  .controller('AuthController', AuthController)

function AuthController($rootScope, $scope, $state, $log, AuthService) {
  const vm = this
  vm.logout = AuthService.logout
  // Not needed at the moment.
  // if (!$rootScope.authData.uid) {
  // 	$log.debug("Please log in");
  // 	$state.go('login');
  // }
}

angular
  .module('Igor')
  .service('AuthService', AuthService)

function AuthService($rootScope, $state, $firebaseAuth, $log, users) {
  const vm = this
  const ref = new Firebase('https://igorapp.firebaseio.com')

  vm.logout = logout
  vm.login = login
  vm.register = register
  $rootScope.authData = $firebaseAuth(ref)

  function logout() {
    $rootScope.authData.$unauth()
    $log.debug('LOGGED OUT')
    $state.go('login')
  }

  function login(user) {
    $log.debug('LOGGING IN')
    $rootScope.authData.$authWithPassword(user)
      .then(res => {
        $log.debug('User logged in')
        $log.debug(res)
        $state.go('dashboard')
      })
      .catch(err => {
        $log.debug('User did not log in')
        $log.debug(err)
      })
  }

  function register(user) {
    $rootScope.authData.$createUser(user)
      .then(res => {
        $log.debug('Success')
        user.id = res.uid
        user.accountCreated = Date.now()
        user.password = null
        users.$add(user)
          .then(res => {
            $log.debug('User added to registration table')
            alert('Thanks for registering! Please re-enter your password to log in...')
          })
          .catch(err => {
            $log.debug('User not added to registration table')
            $log.debug(err)
          })
      })
      .catch(err => {
        $log.debug('Error on Registration')
        $log.debug(err)
      })
  }
}
