angular
	.module('Disco')
	.controller('ClassroomController', ClassroomController);

function ClassroomController($rootScope, $scope, $stateParams, users, classrooms) {

	// Local Vars
	var vm = this;
	var auth = $rootScope.authData.$getAuth();
	var classId = $stateParams.classroomId;
	var myself;

	// Scoped Vars
	vm.addTopic = addTopic;
	vm.removeTopic = removeTopic;
	vm.moveTopic = moveTopic;
	vm.startLecture = startLecture;
	vm.stopLecture = stopLecture;
	vm.respond = respond;
	vm.getResponse = getResponse;
	vm.joinClassroom = joinClassroom;
	vm.moveTopic = moveTopic;
	vm.pullFromQueue = pullFromQueue;

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
							classrooms.forEach(function(element) {
								if (element.$id === classId) {
									$scope.myRoom = element;
									console.log("Classroom Found");
									myself.classes.forEach(function(element) {
										if (element === classId) {
											console.log("User is part of class");
											$scope.joined = true;
										}
									}, this);
									$scope.loaded = true;
								}
							}, this);
						});
				}
			}, this);
			if (!myself) console.log("User not found");
		});
	}

	// OLD STUFF
	// if ($rootScope.authData) {
	// 	myAuth = $rootScope.authData.uid;
	// } else {
	// 	$state.go('login');
	// }
	// Topics.findAll({ classroomId: classId }).then(function(x) {
	// 	var foobar = "classrooms"+classId+"/topics/";
	// 	Topics.create({ body: 'WooT!', classroomId: classId }, { endpoint: foobar });
	// });
	// $scope.joined = false;
	// Classroom.find(classId, { bypassCache: true }).then(function(room) {
	// 	// Classroom.bindAll({}, $scope, "classrooms");
	// 	$scope.classroom = room;
	// 	// debugger;
	// 	load(room);
	//  });

	// move topic from queue to track or track to queue
	function moveTopic(topic) {

	}

	// Add topic to track
	function addTopic(topic) {
		if (!topic) {
			topic = {};
		}
		topic.body = topic.body || 'TEST TOPIC BODY';
		if (!$scope.classroom.topicTrack) {
			$scope.classroom.topicTrack = {};
		}

	}

	// Removes topic from db, regardless of if in track or queue
	function removeTopic(index) {

	}

	// Move all items from queue to track
	function pullFromQueue() {

	}

	// Start lecture
	function startLecture() {
		$scope.classroom.isLecturing = true;
	}

	// Stop lecture, move topics from track to queue
	function stopLecture() {
		$scope.classroom.isLecturing = false;
	}

	// Add student response to db
	function respond(i, response) {
	}

	// Sum student responses from db
	function getResponse(index, response) {
		var out = 0;
		return out;
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

}