'use strict'

angular
  .module('Igor')
  .controller('Navbar.Controller', NavbarController)

function NavbarController($log) {
  $log.debug('Navbar.Controller: initialized')
  const vm = this
}
