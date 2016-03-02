app.controller('DashboardController', function ($rootScope, $scope, $state, DSFirebaseAdapter, model, AuthService) {
	// $scope.logout = function () {
	// 	AuthService.logout();
	// 	$state.go('login');
	// }
	var User = model.user;
	var Classroom = model.classroom;

	Classroom.findAll();
	Classroom.bindAll({}, $scope, 'classrooms');

	$scope.createClassroom = function (name) {
		name = name || 'TEST CLASSROOM';
		Classroom.create({
			instructorId: $rootScope.authData.uid,
			name: name
		})
			.then(function (res) {
				User.find($rootScope.authData.uid).then(function (res2) {
					var user = res2;
					user.classrooms = user.classrooms || [];
					user.classrooms.push(res.id);
					User.update($rootScope.authData.uid, user)
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
		classroom.students = classroom.students || [];
		// if (currentUser is already in classroom) return
		classroom.students.push($rootScope.authData.uid)
		Classroom.update(classroom.id, classroom).then(function (res) {
			User.find($rootScope.authData.uid).then(function (res2) {
				var user = res2;
				user.classrooms = user.classrooms || [];
				console.log(user.classrooms);
				user.classrooms.push(res.id);
				User.update($rootScope.authData.uid, user)
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

	$scope.getStuff = function () {
		User.find('5a0a48ed-533e-4cf8-a245-a47ddaec905c')
			.then(function (data) {
				debugger;
			});
	};

});