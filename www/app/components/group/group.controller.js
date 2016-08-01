'use strict'

angular
  .module('Igor')
  .controller('Group.Controller', GroupController)

function GroupController($log) {
  $log.debug('Group.Controller initialized')
  const vm = this
}
