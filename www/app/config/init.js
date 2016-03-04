// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ui.router', 'js-data', 'firebase'])

app.config(function (DSFirebaseAdapterProvider, DSProvider) {
	DSFirebaseAdapterProvider.defaults.basePath = 'https://discoapp.firebaseio.com';
});


app.run(function ($ionicPlatform, $rootScope, DS, DSFirebaseAdapter, model) {
	$ionicPlatform.ready(function () {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});

	DS.registerAdapter('firebase',
		DSFirebaseAdapter, {
			default: true,
		});

	// Activate a mostly auto-sync with Firebase
	// The only thing missing is auto-sync TO Firebase
	// This will be easier with js-data 2.x, but right
	// now you still have to do DS.update('user', 1, { foo: 'bar' }), etc.
		angular.forEach(model, function(Resource) {
			var ref = DSFirebaseAdapter.ref.child(Resource.endpoint);
			// Inject items into the store when they're added to Firebase
			// Update items in the store when they're modified in Firebase
			ref.on('child_changed', function (dataSnapshot) {
				var data = dataSnapshot.val();
				if (data[Resource.idAttribute]) {
					Resource.inject(data);
				}
			});
			// Eject items from the store when they're removed from Firebase
			ref.on('child_removed', function (dataSnapshot) {
				var data = dataSnapshot.val();
				if (data[Resource.idAttribute]) {
					Resource.eject(data[Resource.idAttribute]);
				}
			});
		});

});

app.factory('model', function (DS) {
	return {
		user: DS.defineResource({
			name: 'user',
			endpoint: 'users',
			relations: {
				hasMany: {
					classrooms: {
						localField: 'classroom',
						foreignKey: 'classroomId'
					}
				}
			}
		}),
		classroom: DS.defineResource({
			name: 'classroom',
			endpoint: 'classrooms',
			relations: {
				belongsTo: {
					user: {
						localField: 'instructor',
						foreignKey: 'instructorId'
					}
				},
				hasMany: {
					users: {
						localField: 'student',
						foreignKey: 'studentId'
					}
				}
			}
		})
	}
});