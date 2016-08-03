'use strict'

angular
  .module('Igor')
  .component('navbar', {
    bindings: {
    },
    controller: 'Navbar.Controller as $ctrl',
    templateUrl: 'app/common/navbar/navbar.html',
  })
