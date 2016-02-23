app.controller('DashboardController', function ($scope, $state, AuthService) {
	$scope.logout = function () {
		AuthService.logout();
		$state.go('login');
	}
});