app.config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/home');
      
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'app/components/home/home.html'
        })
        .state('about', {
          url: '/about',
          templateUrl: 'app/components/about/about.html'
        })
  });