app.controller('ClassroomController', function ($rootScope, $scope, $stateParams, model) {

	var User = model.user;
	var Classroom = model.classroom;
	var myAuth = $rootScope.authData.uid;
	Classroom.find($stateParams.classroomId);
	Classroom.bindOne($stateParams.classroomId, $scope, 'classroom');
	User.find(myAuth);
	User.bindOne(myAuth, $scope, 'user');

	setTimeout(function () {
		console.log($scope.user);
		console.log($scope.classroom);
	}, 500);

});