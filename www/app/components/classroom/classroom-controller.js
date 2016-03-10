angular
	.module('Disco')
	.controller('ClassroomController', ClassroomController);

function ClassroomController($rootScope, $scope, $stateParams, model) {

	// THIS CONTROLLER NEEDS A HUGE REWRITE
	// CREATE SCOPE VARIABLES FOR DISPLAY INFORMATION
	// THINGS LIKE TOTAL NUMBER OF STUDENTS
	// A MANIPULATABLE LOCAL TOPIC ARRAY
	// TOTALS AND INDICATORS FOR TOPIC RESPONSES

	var User = model.user;
	var Classroom = model.classroom;
	var myAuth = $rootScope.authData.uid;
	var classId = $stateParams.classroomId;
	var vm = this;
	var myResponse = null;

	Classroom.find(classId).then(load);

	function load(room) {
		vm.isStudent = true;
		vm.classroom = room;
		User.find(myAuth).then(function() {
			console.log(myAuth, room);
			if (room.instructorId === myAuth) {
				pullFromQueue();
				vm.isStudent = false;
			} else {
				vm.isStudent = true;
			}
			$scope.loaded = true;
			// $scope.$apply();
		});
	}


	// setTimeout(function () {
	// 	console.log($scope.user);
	// 	console.log(vm.classroom);
	// }, 500);

	vm.addTopic = addTopic;
	vm.removeTopic = removeTopic;
	vm.queueTopic = queueTopic;
	vm.startLecture = startLecture;
	vm.stopLecture = stopLecture;
	vm.respond = respond;
	vm.getResponse = getResponse;
	vm.joinClassroom = joinClassroom;

	function addTopic(topic) {
		if (!topic) {
			topic = {};
		}
		topic.body = topic.body || 'TEST TOPIC BODY';
		if (!vm.classroom.topicTrack) {
			vm.classroom.topicTrack = [];
		}
		vm.classroom.topicTrack.push(topic);
		Classroom.save($stateParams.classroomId);
	}

	function removeTopic(index) {
		vm.classroom.topicTrack.splice(index, 1);
		Classroom.save($stateParams.classroomId);
	}

	function queueTopic(index) {
		if (!vm.classroom.topicQueue) {
			vm.classroom.topicQueue = [];
		}
		vm.classroom.topicQueue.push(vm.classroom.topicTrack[index]);
		vm.classroom.topicTrack.splice(index, 1);
		Classroom.save($stateParams.classroomId);
	}

	function pullFromQueue() {
		if (!vm.classroom.topicQueue) {
			return;
		}
		if (!vm.classroom.topicTrack) {
			vm.classroom.topicTrack = [];
		}
		while (vm.classroom.topicQueue.length) {
			vm.classroom.topicTrack.push(vm.classroom.topicQueue.shift());
		}
		Classroom.save($stateParams.classroomId);
	}

	function startLecture() {
		vm.classroom.isLecturing = true;
		Classroom.save($stateParams.classroomId);
	}

	function stopLecture() {
		vm.classroom.isLecturing = false;
		if (!vm.classroom.topicQueue) {
			vm.classroom.topicQueue = [];
		}
		while (vm.classroom.topicTrack.length) {
			vm.classroom.topicQueue.push(vm.classroom.topicTrack.shift());
		}
		Classroom.save($stateParams.classroomId);
	}

	function respond(i, response) {
		myResponse = response;
		if (!vm.classroom.topicTrack[i].response) {
			vm.classroom.topicTrack[i].response = {};
		}
		vm.classroom.topicTrack[i].response[myAuth] = myResponse;
		Classroom.save($stateParams.classroomId);
	}

	function getResponse(index, response) {
		var out = 0;
		for (var key in vm.classroom.topicTrack[index].response) {
			if (vm.classroom.topicTrack[index].response[key] === response) {
				out++;
			}
		}
		return out;
	}

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

}