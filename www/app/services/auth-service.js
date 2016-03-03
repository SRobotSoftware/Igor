app.controller('AuthController', function ($rootScope, $scope, AuthService) {
	$scope.logout = AuthService.logout;
	if (!$rootScope.authData) { AuthService.authMember(); }
});

app.service('AuthService', function ($rootScope, $state, DSFirebaseAdapter, model) {
	var User = model.user;
	var vm = this;

	vm.logout = function () {
		DSFirebaseAdapter.ref.unauth();
		$rootScope.authData = null;
		$state.go('login');
		console.log('LOGGED OUT');
	}

	vm.login = function (user) {
		console.log('LOGGING IN');
		DSFirebaseAdapter.ref.authWithPassword(user, function (error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				$rootScope.authData = authData;
				$state.go('dashboard');
			}
		});
	};

	vm.register = function (user) {
		DSFirebaseAdapter.ref.createUser(user, function (error, authData) {
			if (error) {
				console.log('Registration Failed!', error);
			} else {
				console.log('Registered successfully with payload:', authData);
				User.create({
					email: user.email,
					accountCreated: Date.now(),
					id: authData.uid
				})
					.then(function (res) {
						console.log('success', res);
						$state.go('dashboard');
					})
					.catch(function (res) {
						console.log('err', res);
					});
			}
		});
	};

	vm.authMember = function () {
		var authData = DSFirebaseAdapter.ref.getAuth();
		if (authData) $rootScope.authData = authData;
	};

});