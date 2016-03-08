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

		console.log('FIN');
		return;
	}

}