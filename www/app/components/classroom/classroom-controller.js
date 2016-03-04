app.controller('ClassroomController', function ($rootScope, $scope, $stateParams, model) {

	var User = model.user;
	var Classroom = model.classroom;
	var myAuth = $rootScope.authData.uid;
	Classroom.find($stateParams.classroomId);
	Classroom.bindOne($stateParams.classroomId, $scope, 'classroom');
	$scope.isStudent = true;
	User.find(myAuth).then(function () {
		setTimeout(function () {
			$scope.$apply(function () {
				($scope.classroom.instructorId === myAuth) ? $scope.isStudent = false : $scope.isStudent = true;
				if (!$scope.isStudent) pullFromQueue();
			}, 1);
		});
	});
	User.bindOne(myAuth, $scope, 'user');
	var myResponse = null;


	// setTimeout(function () {
	// 	console.log($scope.user);
	// 	console.log($scope.classroom);
	// }, 500);

	$scope.addTopic = function (topic) {
		if (!topic) topic = {};
		topic.body = topic.body || "TEST TOPIC BODY";
		if (!$scope.classroom.topicTrack) {
			$scope.classroom.topicTrack = [];
		}
		$scope.classroom.topicTrack.push(topic);
		Classroom.save($stateParams.classroomId);
	}

	$scope.removeTopic = function (index) {
		$scope.classroom.topicTrack.splice(index, 1);
		Classroom.save($stateParams.classroomId);
	}

	$scope.queueTopic = function (index) {
		if (!$scope.classroom.topicQueue) $scope.classroom.topicQueue = [];
		$scope.classroom.topicQueue.push($scope.classroom.topicTrack[index]);
		$scope.classroom.topicTrack.splice(index, 1);
		Classroom.save($stateParams.classroomId);
	}

	function pullFromQueue() {
		if (!$scope.classroom.topicQueue) return;
		if (!$scope.classroom.topicTrack) $scope.classroom.topicTrack = [];
		while ($scope.classroom.topicQueue.length) {
			$scope.classroom.topicTrack.push($scope.classroom.topicQueue.shift());
		}
		Classroom.save($stateParams.classroomId);
	}

	$scope.startLecture = function () {
		$scope.classroom.isLecturing = true;
		Classroom.save($stateParams.classroomId);
	}

	$scope.stopLecture = function () {
		$scope.classroom.isLecturing = false;
		if (!$scope.classroom.topicQueue) $scope.classroom.topicQueue = [];
		while ($scope.classroom.topicTrack.length) {
			$scope.classroom.topicQueue.push($scope.classroom.topicTrack.shift());
		}
		Classroom.save($stateParams.classroomId);
	}

	$scope.respond = function (i, response) {
		myResponse = response;
		if (!$scope.classroom.topicTrack[i].response) $scope.classroom.topicTrack[i].response = {};
		$scope.classroom.topicTrack[i].response[myAuth] = myResponse;
		Classroom.save($stateParams.classroomId);
	}

	$scope.getResponse = function (index, response) {
		var out = 0;
		for (var key in $scope.classroom.topicTrack[index].response) {
			if ($scope.classroom.topicTrack[index].response[key] === response) out++;
		}
		return out;
	};

});