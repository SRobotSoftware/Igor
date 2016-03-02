app.controller('DashboardController', function ($rootScope, $scope, $state, DSFirebaseAdapter, model, AuthService) {
	// $scope.logout = function () {
	// 	AuthService.logout();
	// 	$state.go('login');
	// }
	var User = model.user;
	var Classroom = model.classroom;
	var myAuth = $rootScope.authData.uid;

	Classroom.findAll();
	Classroom.bindAll({}, $scope, 'classrooms');
	User.findAll();
	User.bindAll({}, $scope, 'users');

	$scope.createClassroom = function (name) {
		name = name || 'TEST CLASSROOM';
		Classroom.create({
			instructorId: $rootScope.authData.uid,
			name: name
		})
			.then(function (res) {
				User.find(myAuth).then(function (res2) {
					var user = res2;
					var myClass = res.id.split('');
					myClass.shift();
					myClass = myClass.join('');
					user.classrooms = user.classrooms || {};
					user.classrooms[myClass] = myClass;
					User.update(myAuth, user)
						.then(function (res) {
							console.log('suc', res);
						})
						.catch(function (res) {
							console.log('err', res);
						});
					console.log('success', res);
				})
					.catch(function (res) {
						console.log('err', res);
					});
			})
			.catch(function (res) {
				console.log('err', res);
			});
	};


	$scope.joinClassroom = function (classroom) {
		if (classroom.instructorId === myAuth) return;
		classroom.students = classroom.students || {};
		classroom.students[myAuth] = myAuth;
		Classroom.update(classroom.id, classroom).then(function (res) {
			var myClass = res.id.split('');
			myClass.shift();
			myClass = myClass.join('');
			User.find(myAuth).then(function (res2) {
				var user = res2;
				user.classrooms = user.classrooms || {};
				user.classrooms[myClass] = myClass;
				User.update(myAuth, user)
					.then(function (res) {
						console.log('suc', res);
					})
					.catch(function (res) {
						console.log('err', res);
					});
				console.log('success', res);
			})
				.catch(function (res) {
					console.log('err', res);
				});
		})
			.catch(function (res) {
				console.log('err', res);
			});
	};

	$scope.removeClassroom = function (classroom) {
		Classroom.destroy(classroom.id);

	}

	$scope.convertUser = function (user) {
		for (var i = 0; i < $scope.users.length; i++) {
			if ($scope.users[i].id === user) return $scope.users[i].name || $scope.users[i].email
		}
		return "Sorry no user found";
	}

});