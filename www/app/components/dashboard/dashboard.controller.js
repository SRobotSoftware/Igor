'use strict'

angular
  .module('Igor')
  .controller('Dashboard.Controller', DashboardController)

function DashboardController($log) {
  $log.debug('Dashboard.Controller initialized')
  const vm = this
}
