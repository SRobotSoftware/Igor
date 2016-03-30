angular
	.module('Igor')
	.controller('DashboardController', DashboardController);

function DashboardController($rootScope, $scope, $state, AuthService, users, classrooms) {

	// Local Vars
	var auth = $rootScope.authData.$getAuth();
	var vm = this;
	var myself;

	// Scoped Vars
	vm.createClassroom = createClassroom;
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
						})
						.catch(function(x) {
							console.log("Classrooms not found");
							console.log(x);
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
			if (element.instructorId === myself.id) {
				result.push(element);
			} else {
				if (element.students[myself.id]) result.push(element);
			}
		}, this);
		$scope.classrooms = result;
		$scope.loaded = true;
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
			description: newClassroom.description,
			isLecturing: false
		})
			.then(function(res) {
				console.log("Added class successfully");
				console.log(res.path.u[1]);
				if (myself.classes) {
					myself.classes[res.path.u[1]] = res.path.u[1];
				} else {
					myself.classes = {};
					myself.classes[res.path.u[1]] = res.path.u[1];
				}
				users.$save(myself);
				findClassrooms();
			})
			.catch(function(res) {
				console.log("Error adding class");
				console.log(res);
			});
	}

	// Destroy classroom
	function removeClassroom(classroom) {
		// If there's any students, remove the classroom from their list as well
		var myKeys = Object.keys(classroom.students);
		if (myKeys.length) {
			for (var student in myKeys) {
				removeClassFromUser(myKeys[student], classroom);
			}
		}
		removeClassFromUser(classroom.instructorId, classroom);
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
		var myUser;
		users.forEach(function(element) {
			if (element.id === userToTarget) myUser = element;
		}, this);
		myUser.classes[classToRemove.$id] = null;
		users.$save(myUser);
	}

	// Remove user reference from classroom
	function removeUserFromClass(classToTarget, userToRemove) {
		classToTarget.students[userToRemove.id] = null;
		classrooms.$save(classToTarget);
	}
}