'use strict'

angular
  .module('Igor')
  .component('dashboard', {
    bindings: {
    },
    controller: 'Dashboard.Controller as $ctrl',
    templateUrl: 'app/components/dashboard/dashboard.html',
  })
