'use strict'

angular
  .module('Igor')
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/login')

    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login></login>',
      })
      .state('dashboard', {
        url: '/dashboard',
        template: '<dashboard></dashboard>',
      })
      .state('queue', {
        url: '/queue/:groupId',
        template: '<queue></queue>',
      })
      .state('group', {
        url: '/dashboard/:groupId',
        template: '<group></group>',
      })
  })
