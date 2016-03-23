angular
	.module('Igor', [
		'ui.router',
		'firebase',
	])
	.config(function() {

	})
	.run(function() {
		// var ref = new Firebase(CONSTANTS.fbRef);
		// ref.on("value", function(snapshot) {
		// 	$scope.$apply(function() {
		// 		$scope.data = snapshot.val();
		// 	});
		// });
	})
	.factory('users', ["$firebaseArray", users])
	.factory('classrooms', ["$firebaseArray", classrooms]);

function users($firebaseArray) {
	var ref = new Firebase("https://igorapp.firebaseio.com/users");
	return $firebaseArray(ref);
}

function classrooms($firebaseArray) {
	var ref = new Firebase("https://igorapp.firebaseio.com/classrooms");
	return $firebaseArray(ref);
}