angular
	.module('Igor')
	.controller('AuthController', AuthController);

function AuthController($rootScope, $scope, $state, AuthService) {
	var vm = this;
	vm.logout = AuthService.logout;
	// Not needed at the moment.
	// if (!$rootScope.authData.uid) {
	// 	console.log("Please log in");
	// 	$state.go('login');
	// }
}

angular
	.module('Igor')
	.service('AuthService', AuthService);

function AuthService($rootScope, $state, $firebaseAuth, users) {
	var vm = this;
	var ref = new Firebase("https://igorapp.firebaseio.com");

	vm.logout = logout;
	vm.login = login;
	vm.register = register;
	$rootScope.authData = $firebaseAuth(ref);

	function logout() {
		$rootScope.authData.$unauth();
		console.log('LOGGED OUT');
		$state.go('login');
	}

	function login(user) {
		console.log('LOGGING IN');
		$rootScope.authData.$authWithPassword(user)
			.then(function(res) {
				console.log("User logged in");
				console.log(res);
				$state.go("dashboard");
			})
			.catch(function(res) {
				console.log("User did not log in");
				console.log(res);
			});
	}

	function register(user) {
		$rootScope.authData.$createUser(user)
			.then(function(res) {
				console.log("Success");
				console.log(res);
				user.id = res.uid;
				user.accountCreated = Date.now();
				user.password = null;
				users.$add(user)
					.then(function(res) {
						console.log("User added to table");
						console.log(res);
						$state.go("dashboard");
					}).catch(function(res) {
						console.log("User not added to table");
						console.log(res);
					});
			})
			.catch(function(res) {
				console.log("Error on Registration");
				console.log(res);
			});
	}

}