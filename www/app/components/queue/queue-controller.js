angular
	.module('Igor')
	.controller('QueueController', QueueController);

function QueueController($rootScope, $scope, $stateParams, $firebaseArray, $state, users, classrooms) {

	// Local Vars
	var vm = this;
	var auth = $rootScope.authData.$getAuth();
	var classId = $stateParams.classroomId;
	var myself;

	// Scoped Vars
	vm.answer = answer;
	vm.convertObject = convertObject;

	// Load data
	load();

	// Functions

	// Convert Object to Array
	function convertObject(object) {
		var out = [];
		if (!object) object = {};
		Object.keys(object).forEach(function(element) {
			out.push(object[element]);
		}, this);
		return out;
	}

	// Answer question
	function answer(question) {
		var current = null;
		var currentIndex = null;
		for (var i = 0; i < $scope.myRoom.questionsOld.length; i++) {
			if ($scope.myRoom.questionsOld[i].id === question.id) {
				current = $scope.myRoom.questionsOld[i];
				currentIndex = i;
			}
		}
		if (current) {
			current.answeredAt = Date.now();
			current.answeredBy = $scope.me;
			classrooms.forEach(function(element) {
				if (element.$id === classId) {
					element.questionsOld[currentIndex] = current;
					element.questions[question.id] = null;
					classrooms.$save(element);
				}
			}, this);
		}
	}

	// Load data
	function load() {
		if (!auth) {
			console.log("Auth failed, please log in.");
			$state.go("login");
			return;
		}
		$scope.today = moment();
		users.$loaded().then(function(x) {
			$scope.users = users;
			users.forEach(function(element) {
				if (element.id === auth.uid) {
					myself = element;
					$scope.myself = element;
					$scope.me = myself.id;
					console.log("User Found");
					classrooms.$loaded()
						.then(function(x) {
							classrooms.forEach(function(element) {
								if (element.$id === classId) {
									$scope.myRoom = element;
									console.log("Classroom Found");
									$scope.loaded = true;
									var allowed = false;
									for (var member in element.mentors) {
										if (member === $scope.me) allowed = true;
									}
									if (element.instructorId === $scope.me) allowed = true;
									if (!allowed) {
										console.log("Sorry, you're not authorized to be here.");
										$state.go("dashboard");
									}
								}
							}, this);
						});
				}
			}, this);
			if (!myself) console.log("User not found");
		});
	}

}