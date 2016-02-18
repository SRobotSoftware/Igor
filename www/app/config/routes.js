app.config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/login');
      
      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'app/components/login/login.html'
        })
        .state('about', {
          url: '/about',
          templateUrl: 'app/components/about/about.html'
        })
        .state('dashboard', {
          url: '/dashboard',
          tempalteUrl: 'app/components/dashboard/dashboard.html'
        })
  });