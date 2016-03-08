angular
	.module('Disco')
	.factory('DataFactory', DataFactory);

function DataFactory($rootScope, model) {

	var User = model.user;
	var Classroom = model.classroom;
	var myAuth = $rootScope.authData.uid;
	var service = {
		loadClassroom: loadClassroom
	};
	return service;

	//////

	function loadClassroom(classId) {
		// Classroom.find(classId);
		// Classroom.bindOne(classId, $scope, 'classroom');
		// $rootScope.isStudent = true;
		// User.find(myAuth).then(function() {
		// 	console.log(myAuth, $scope.classroom);
		// 	if ($scope.classroom.instructorId === myAuth) {
		// 		$rootScope.isStudent = false;
		// 	} else {
		// 		$rootScope.isStudent = true;
		// 		}
		// });
		// User.bindOne(myAuth, $scope, 'user');
		console.log('FIN');
		return;
	}

}