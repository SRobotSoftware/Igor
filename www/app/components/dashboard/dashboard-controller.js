angular
	.module('Disco')
	.controller('DashboardController', DashboardController);

function DashboardController($rootScope, $scope, $state, DSFirebaseAdapter, model, AuthService, DataFactory) {

	var User = model.user;
	var Classroom = model.classroom;
	var myAuth = $rootScope.authData.uid;
	var vm = this;
	// Delay to prevent errors with convertUser on view
	setTimeout(function() {
		$rootScope.formTimer = true;
	}, 10);

	Classroom.findAll();
	Classroom.bindAll({}, $scope, 'classrooms');
	User.findAll();
	User.bindAll({}, $scope, 'users');

	vm.createClassroom = createClassroom;
	vm.joinClassroom = joinClassroom;
	vm.removeClassroom = removeClassroom;
	vm.removeClassroom = removeClassroom;
	vm.leaveClassroom = leaveClassroom;
	vm.convertUser = convertUser;

	// Create Classroom
	function createClassroom(newClassroom) {
		if (!newClassroom) {
			newClassroom = {};
		}
		newClassroom.name = newClassroom.name || convertUser(myAuth) + '\'s Classroom';
		newClassroom.description = newClassroom.description || 'A fun place to learn!';
		Classroom.create({
			instructorId: $rootScope.authData.uid,
			name: newClassroom.name,
			description: newClassroom.description
		})
			.then(function(res) {
				User.find(myAuth).then(function(res2) {
					var user = res2;
					var myClass = res.id.split('');
					myClass.shift();
					myClass = myClass.join('');
					user.classrooms = user.classrooms || {};
					user.classrooms[myClass] = myClass;
					User.update(myAuth, user)
						.then(function(res) {
							console.log('suc', res);
						})
						.catch(function(res) {
							console.log('err', res);
						});
					console.log('success', res);
				})
					.catch(function(res) {
						console.log('err', res);
					});
			})
			.catch(function(res) {
				console.log('err', res);
			});
	};

	// Join classroom
	function joinClassroom(classroom) {
		if (classroom.instructorId === myAuth) {
			return;
		}
		classroom.students = classroom.students || {};
		classroom.students[myAuth] = myAuth;
		Classroom.update(classroom.id, classroom).then(function(res) {
			var myClass = res.id.split('');
			myClass.shift();
			myClass = myClass.join('');
			User.find(myAuth).then(function(res2) {
				var user = res2;
				user.classrooms = user.classrooms || {};
				user.classrooms[myClass] = myClass;
				User.update(myAuth, user)
					.then(function(res) {
						console.log('suc', res);
					})
					.catch(function(res) {
						console.log('err', res);
					});
				console.log('success', res);
			})
				.catch(function(res) {
					console.log('err', res);
				});
		})
			.catch(function(res) {
				console.log('err', res);
			});
	}

	// Destroy classroom
	function removeClassroom(classroom) {
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

	// Remove classroom from list
	function leaveClassroom(classroom) {
		removeUserFromClass(classroom, myAuth);
		removeClassFromUser(myAuth, classroom);
	}

	// Convert uid to Name or Email or err
	function convertUser(user) {
		for (var i = 0; i < $scope.users.length; i++) {
			if ($scope.users[i].id === user) {
				return $scope.users[i].name || $scope.users[i].email;
			}
		}
		return 'None :(';
	}

	// Removes classroom reference from user
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
		userToTarget.classrooms[myClass] = null;
		// Update the DS
		// User.update(user.id, user)
		// Push through adapter
		User.save(userToTarget.id);
	}

	// Remove user reference from classroom
	function removeUserFromClass(classToTarget, userToRemove) {
		for (var i = 0; i < $scope.classrooms.length; i++) {
			if ($scope.classrooms[i] === classToTarget) {
				$scope.classrooms[i].students[userToRemove] = null;
			}
		}
		Classroom.save(classToTarget);
	}
}