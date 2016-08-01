'use strict'

angular
  .module('Igor')
  .component('queue', {
    bindings: {
    },
    controller: 'Queue.Controller as $ctrl',
    templateUrl: 'app/components/queue/queue.html',
  })
