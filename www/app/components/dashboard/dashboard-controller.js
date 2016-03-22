angular
	.module('Disco')
	.controller('DashboardController', DashboardController);

function DashboardController($rootScope, $scope, $state, AuthService, users, classrooms) {

	// Local Vars
	var auth = $rootScope.authData.$getAuth();
	var vm = this;
	var myself;

	// Scoped Vars
	vm.createClassroom = createClassroom;
	vm.joinClassroom = joinClassroom;
	vm.removeClassroom = removeClassroom;
	vm.removeClassroom = removeClassroom;
	vm.leaveClassroom = leaveClassroom;
	vm.convertUser = convertUser;
	vm.isInstructor = isInstructor;
	vm.displayLink = displayLink;

	// Load data
	load();

	// Functions

	// Load data
	function load() {
		if (!auth) {
			console.log("Auth failed, please log in.");
			$state.go("login");
			return;
		}
		users.$loaded().then(function(x) {
			users.forEach(function(element) {
				if (element.id === auth.uid) {
					myself = element;
					console.log("User Found");
					classrooms.$loaded()
						.then(function(x) {
							findClassrooms();
							console.log("Classrooms Found");
						});
				}
			}, this);
			if (!myself) console.log("User not found");
		});
	}

	// Displays a link with the proper URL for a given classroom
	function displayLink(room) {
		var out = 'http://giskard.us/#/dashboard/' + room.$id;
		return out;
	}

	// Checks if user is the instructor for a given classroom
	function isInstructor(classroom) {
		return classroom.instructorId === myself.id;
	}

	// Finds all Classrooms the user participates in
	function findClassrooms() {
		var result = [];
		classrooms.forEach(function(element) {
			if (!element.students) element.students = [];
			if (element.instructorId === myself.id || element.students[myself.id]) result.push(element);
		}, this);
		$scope.loaded = true;
		$scope.classrooms = result;
	}

	// Create Classroom
	function createClassroom(newClassroom) {
		if (!newClassroom) {
			newClassroom = {};
		}
		newClassroom.name = newClassroom.name || myself.email + '\'s Classroom';
		newClassroom.description = newClassroom.description || 'A fun place to learn!';
		classrooms.$add({
			instructorId: myself.id,
			name: newClassroom.name,
			description: newClassroom.description
		})
			.then(function(res) {
				console.log("Added class successfully");
				console.log(res.path.u[1]);
				if (myself.classes) {
					myself.classes.push(res.path.u[1]);
				} else {
					myself.classes = [];
					myself.classes.push(res.path.u[1]);
				}
				users.$save(myself);
				findClassrooms();
			})
			.catch(function(res) {
				console.log("Error adding class");
				console.log(res);
			});
	}

	// Join classroom
	function joinClassroom(classroom) {
		if (classroom.instructorId === myself.id) {
			return;
		}
		myself.classes.push(classroom.$id);
		classrooms.students.push(myself.id);
		users.$save(myself);
		classrooms.$save(classroom);
	}

	// Destroy classroom
	function removeClassroom(classroom) {
		// If there's any students, remove the classroom from their list as well
		if (classroom.students.length) {
			classroom.students.forEach(function(student) {
				removeClassFromUser(student, classroom);
			}, this);
		}
		removeClassFromUser(myself, classroom);
		// removeClassFromUser(classroom.instructorId, classroom);
		classrooms.$remove(classroom)
			.then(function(x) {
				findClassrooms();
			});
	}

	// Remove classroom from list
	function leaveClassroom(classroom) {
		removeUserFromClass(classroom, myself);
		removeClassFromUser(myself, classroom);
		findClassrooms(myself);
	}

	// Convert uid to Name or Email or err
	function convertUser(user) {
		users.forEach(function(element) {
			if (element.id === user) {
				result = element.name || element.email;
			}
		}, this);
		if (result) return result;
		return 'Name not Found';
	}

	// Removes classroom reference from user
	function removeClassFromUser(userToTarget, classToRemove) {
		for (var i = 0; i < userToTarget.classes.length; i++) {
			if (userToTarget.classes[i] === classToRemove.$id) {
				userToTarget.classes[i] = null;
			}
		}
		users.$save(userToTarget);
	}

	// Remove user reference from classroom
	function removeUserFromClass(classToTarget, userToRemove) {
		debugger;
		for (var i = 0; i < classToTarget.students.length; i++) {
			if (classToTarget.students[i] === userToRemove) {
				classToTarget.students[i] = null;
			}
		}
		classrooms.$save(classToTarget);
	}
}