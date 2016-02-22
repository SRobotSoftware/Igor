app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');

	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'app/components/login/login.html'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'app/components/register/register.html'
		})
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'app/components/dashboard/dashboard.html'
		})
		.state('classroom', {
			url: '/classroom', // Pull uid from URL
			templateUrl: 'app/components/classroom/classroom.html'
		})
});