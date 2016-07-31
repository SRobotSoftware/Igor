'use strict'

angular
  .module('Igor', [
    'ui.router',
    'firebase',
    'angularMoment',
  ])
  .config(() => {

  })
  .run(() => {
    // var ref = new Firebase(CONSTANTS.fbRef);
    // ref.on("value", function(snapshot) {
    // 	$scope.$apply(function() {
    // 		$scope.data = snapshot.val();
    // 	});
    // });
  })
  .factory('users', ['$firebaseArray', users])
  .factory('classrooms', ['$firebaseArray', classrooms])

function users($firebaseArray) {
  const ref = new Firebase('https://igorapp.firebaseio.com/users')
  return $firebaseArray(ref)
}

function classrooms($firebaseArray) {
  const ref = new Firebase('https://igorapp.firebaseio.com/classrooms')
  return $firebaseArray(ref)
}
