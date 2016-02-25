/* global Firebase */
app.controller('LoginController', function ($rootScope, $scope, $state, DSFirebaseAdapter, User, Classroom) {

	$scope.login = function (user) {
		DSFirebaseAdapter.ref.authWithPassword(user, function (error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				$rootScope.authData = authData;
			}
		});
	};

	$scope.register = function (user) {
		DSFirebaseAdapter.ref.createUser(user, function (error, authData) {
			if (error) {
				console.log('Registration Failed!', error);
			} else {
				console.log('Registered successfully with payload:', authData);
				User.create({ email: user.email, accountCreated: Date.now(), id: authData.uid })
					.then(function (res) {
						console.log('success', res);
					})
					.catch(function (res) {
						console.log('err', res);
					});
			}
		});
	};

	$scope.createClassroom = function () {
				Classroom.create({ instructor: $rootScope.authData.uid })
			.then(function (res) {
				console.log('success', res);
			})
			.catch(function (res) {
				console.log('err', res);
			});
		};

		Classroom.findAll({}, { bypassCache: true });
		Classroom.bindAll({}, $scope, 'bob');
		$scope.joinClassroom = function (classroom) {
		classroom.student = "tom"
		Classroom.update(classroom.id, classroom).then(function (d) {
			console.log('suc', d);
		}).catch(function (err) { console.log('err', err) });
		};

	function clearErr() {
		$scope.authErr = '';
	}

	function handleDBResponse(err) {
		if (err) {
			$scope.authErr = err.message;
			$scope.$apply();
		} else {
			$state.go('dashboard');
		}
	}

	$scope.getStuff = function () {
		User.find('5a0a48ed-533e-4cf8-a245-a47ddaec905c')
			.then(function (data) {
				debugger;
			});

	};

});