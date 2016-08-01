'use strict'

angular
  .module('Igor')
  .controller('Queue.Controller', QueueController)

function QueueController($log) {
  $log.debug('Queue.Controller initialized')
  const vm = this
}
