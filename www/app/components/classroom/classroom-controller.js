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
			}, 1);
		});
	});
	User.bindOne(myAuth, $scope, 'user');


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
		console.log(index);
		$scope.classroom.topicTrack.splice(index, 1);
		Classroom.save($stateParams.classroomId);
	}

});