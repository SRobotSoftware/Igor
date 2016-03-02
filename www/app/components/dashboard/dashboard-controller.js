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
	// Remove classroom from list
	$scope.removeClassroom = function (classroom) {
		// If there's any students, remove the classroom from their list as well
		if (classroom.students) {
			// loop through students
			for (var i = 0; i < Object.keys(classroom.students).length; i++) {
				console.log(Object.keys(classroom.students));
				var current = Object.keys(classroom.students)[i];
				removeClassFromUser(current, classroom);
			}
		}
		removeClassFromUser(classroom.instructorId, classroom);
		Classroom.destroy(classroom.id);
	}

	function removeClassFromUser(userToTarget, classToRemove) {
		for (var i = 0; i < $scope.users.length; i++) {
			if ($scope.users[i].id === userToTarget) {
				var user = $scope.users[i];
			}
		}
		// Take off the stupid '/' on the id
		var myClass = classToRemove.id.split('');
		myClass.shift();
		myClass = myClass.join('');
		// Remove class from local scope
		user.classrooms[myClass] = null;
		// Update the DS
		console.log('PRE-UPDATE USER:', user);
		User.update(user.id, user).then(function (res) {
			console.log('UPDATE SUCCESS', res)
		}).catch(function (res) {
			console.log('UPDATE ERR', res)
		});
		// Push through adapter
		User.save(user.id);
	}

	$scope.convertUser = function (user) {
		for (var i = 0; i < $scope.users.length; i++) {
			if ($scope.users[i].id === user) return $scope.users[i].name || $scope.users[i].email
		}
		return "Sorry no user found";
	}

});