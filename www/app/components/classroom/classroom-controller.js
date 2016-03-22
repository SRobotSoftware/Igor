angular
	.module('Disco')
	.controller('ClassroomController', ClassroomController);

function ClassroomController($rootScope, $scope, $stateParams, model, DS) {

	var User = model.user;
	var Classroom = model.classroom;
	var Topics = model.topics;

	var myAuth;
	if ($rootScope.authData) {
		myAuth = $rootScope.authData.uid;
	} else {
		$state.go('login');
	}
	var classId = $stateParams.classroomId;
	var vm = this;
	var myResponse = null;
	Topics.findAll({ classroomId: classId }).then(function(x) {
		var foobar = "classrooms"+classId+"/topics/";
		Topics.create({ body: 'WooT!', classroomId: classId }, { endpoint: foobar });
	});
	$scope.joined = false;
	Classroom.find(classId, { bypassCache: true }).then(function(room) {
		// Classroom.bindAll({}, $scope, "classrooms");
		$scope.classroom = room;
		// debugger;
		load(room);
	 });
	vm.addTopic = addTopic;
	vm.removeTopic = removeTopic;
	vm.removeTopicQ = removeTopicQ;
	vm.queueTopic = queueTopic;
	vm.startLecture = startLecture;
	vm.stopLecture = stopLecture;
	vm.respond = respond;
	vm.getResponse = getResponse;
	vm.joinClassroom = joinClassroom;
	vm.addToList = addToList;
	vm.pullFromQueue = pullFromQueue;

	function load(room) {
		vm.isStudent = true;
		User.find(myAuth, { bypassCache: true }).then(function() {
			console.log(myAuth, room);
			if (room.instructorId === myAuth) {
				pullFromQueue();
				vm.isStudent = false;
				$scope.joined = true;
			} else {
				vm.isStudent = true;
				if (!room.students) room.students = {};
				if (room.students[myAuth]) $scope.joined = true;
			}
			$scope.loaded = true;
		});
	}

	function addToList(topic) {
		$scope.classroom.topicTrack.push($scope.classroom.topicQueue[topic]);
		$scope.classroom.topicQueue.splice(topic, 1);
		$scope.classroom.DSSave();
	}

	function addTopic(topic) {
		if (!topic) {
			topic = {};
		}
		topic.body = topic.body || 'TEST TOPIC BODY';
		if (!$scope.classroom.topicTrack) {
			$scope.classroom.topicTrack = {};
		}
		// Need to access an object instead of an array
		$scope.classroom.topicTrack.create(topic).then(function(res) { console.log(res); }).catch(function(res) { console.log(res);});
		// $scope.classroom.topicTrack.push(topic);
		$scope.classroom.DSSave();
	}

	function removeTopic(index) {
		// delete $scope.classroom.topicTrack[index];
		// Classroom.DSSave();
		// var options = { endpoint: "topicTrack" };
		// Classroom.destroy(index, options).then(function(res) { console.log(res);}).catch(function(res) { console.log(res);});
		$scope.classroom.topicTrack.splice(index, 1);
		$scope.classroom.DSSave();
	}

	function removeTopicQ(index) {
		$scope.classroom.topicQueue.splice(index, 1);
		$scope.classroom.DSSave();
	}

	function queueTopic(index) {
		if (!$scope.classroom.topicQueue) {
			$scope.classroom.topicQueue = [];
		}
		$scope.classroom.topicQueue.push($scope.classroom.topicTrack[index]);
		$scope.classroom.topicTrack.splice(index, 1);
		$scope.classroom.DSSave();
	}

	function pullFromQueue() {
		if (!$scope.classroom.topicQueue) {
			return;
		}
		if (!$scope.classroom.topicTrack) {
			$scope.classroom.topicTrack = [];
		}
		while ($scope.classroom.topicQueue.length) {
			$scope.classroom.topicTrack.push($scope.classroom.topicQueue.shift());
		}
		$scope.classroom.DSSave();
	}

	function startLecture() {
		$scope.classroom.isLecturing = true;
		$scope.classroom.DSSave();
		// $scope.classroom.DSSave();
	}

	function stopLecture() {
		$scope.classroom.isLecturing = false;
		if (!$scope.classroom.topicQueue) {
			$scope.classroom.topicQueue = [];
		}
		while ($scope.classroom.topicTrack.length) {
			$scope.classroom.topicQueue.push($scope.classroom.topicTrack.shift());
		}
		$scope.classroom.DSSave();
	}

	function respond(i, response) {
		myResponse = response;
		if (!$scope.classroom.topicTrack[i].response) {
			$scope.classroom.topicTrack[i].response = {};
		}
		$scope.classroom.topicTrack[i].response[myAuth] = myResponse;
		$scope.classroom.DSSave();
	}

	function getResponse(index, response) {
		var out = 0;
		for (var key in $scope.classroom.topicTrack[index].response) {
			if ($scope.classroom.topicTrack[index].response[key] === response) {
				out++;
			}
		}
		return out;
	}

	function joinClassroom(classroom) {
		if (classroom.instructorId === myAuth) return;
		classroom.students = classroom.students || {};
		if (classroom.students[myAuth]) return;
		classroom.students[myAuth] = myAuth;
		Classroom.update(classroom.id, classroom).then(function(res) {
			var myClass = res.id.split('');
			myClass.shift();
			myClass = myClass.join('');
			User.find(myAuth, { bypassCache: true }).then(function(res2) {
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
		$scope.joined = true;
	}

}