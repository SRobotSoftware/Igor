'use strict'

angular
  .module('Igor')
  .controller('Dashboard.Controller', DashboardController)

function DashboardController($log, $state, AuthService, DataService) {
  $log.debug('Dashboard.Controller: initialized')
  const vm = this
  onLoad()

  DataService.getData().then(res => $log.debug('DATASERVICE DATA', res))


  function onLoad() {
    $log.debug('Dashboard.Controller: Checking Auth:')
    if (AuthService.getUser()) $log.debug('Success')
    else {
      $log.debug('Fail')
      $state.go('login')
    }
  }
}
