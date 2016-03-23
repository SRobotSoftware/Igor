angular
	.module('Igor')
	.controller('ClassroomController', ClassroomController);

function ClassroomController($rootScope, $scope, $stateParams, $firebaseArray, $state, users, classrooms) {

	// Local Vars
	var vm = this;
	var auth = $rootScope.authData.$getAuth();
	var classId = $stateParams.classroomId;
	var myself;

	// Scoped Vars
	$scope.myTopics = $firebaseArray(new Firebase("https://igorapp.firebaseio.com/classrooms/" + classId + "/topics"));
	$scope.isStudent = true;
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
	vm.responseCount = responseCount;

	// Load data
	load();

	// Functions

	function responseCount(topic, response) {
		var out = 0;
		if (!response) {
			if (topic.responses) out = Object.keys(topic.responses).length;
		} else {
			for (var res in topic.responses) {
				if (topic.responses[res] === response) out++;
			}
		}
		return out;
	}

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
									if (!myself.classes) myself.classes = {};
									if (myself.classes[classId]) {
										console.log("User is part of class");
										$scope.joined = true;
									}
									$scope.loaded = true;
									if (myself.id === $scope.myRoom.instructorId) $scope.isStudent = false;
								}
							}, this);
						});
				}
			}, this);
			if (!myself) console.log("User not found");
		});
	}

	// move topic from queue to track or track to queue
	function moveTopic(topic) {
		var myTopic = $scope.myTopics.$indexFor(topic);
		$scope.myTopics[myTopic].track = !$scope.myTopics[myTopic].track;
		$scope.myTopics.$save(myTopic);
	}

	// Add topic to track
	function addTopic(topic) {
		if (!topic) topic = {};
		topic.body = topic.body || 'EXAMPLE TOPIC BODY';
		topic.track = true;
		$scope.myTopics.$add(topic);
	}

	// Removes topic from db
	function removeTopic(topic) {
		$scope.myTopics.$remove($scope.myTopics.$indexFor(topic));
	}

	// Move all items from queue to track
	function pullFromQueue() {
		for (var topic in $scope.myTopics) {
			$scope.myTopics[topic].track = true;
			$scope.myTopics.$save($scope.myTopics[topic]);
		}
		classrooms.$save($scope.myRoom);
	}

	// Move all itesm from track to queue
	function pullfromTrack() {
		for (var topic in $scope.myTopics) {
			$scope.myTopics[topic].track = false;
			$scope.myTopics.$save($scope.myTopics[topic]);
		}
	}

	// Start lecture
	function startLecture() {
		$scope.myRoom.isLecturing = true;
		classrooms.$save($scope.myRoom);
	}

	// Stop lecture, move topics from track to queue
	function stopLecture() {
		pullfromTrack();
		$scope.myRoom.isLecturing = false;
		classrooms.$save($scope.myRoom);
	}

	// Add student response to db
	function respond(i, response) {
		if (!i.responses) i.responses = {};
		i.responses[myself.id] = response;
		$scope.myTopics.$save(i);
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
		console.log("joining classroom");
		if (!myself.classes) myself.classes = {};
		myself.classes[classId] = classId;
		if (!classroom.students) classroom.students = {};
		classroom.students[myself.id] = myself.id;
		users.$save(myself);
		classrooms.$save(classroom);
		$scope.joined = true;
		$state.reload();
	}

}