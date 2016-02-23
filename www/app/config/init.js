// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ui.router', 'js-data', 'firebase'])

app.config(function (DSFirebaseAdapterProvider) {
	DSFirebaseAdapterProvider.defaults.basePath = 'https://discoapp.firebaseio.com';
});

app.run(function ($ionicPlatform, $rootScope, DS, DSFirebaseAdapter, User, AuthService) {
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

		$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
		AuthService.authMember();
	});

	DS.registerAdapter('firebase',
		DSFirebaseAdapter,
		{ default: true });

	angular.forEach(DS.definitions, function (Resource) {
		var ref = DSFirebaseAdapter.ref.child(Resource.endpoint);
		ref.on('child_changed', function (dataSnapshot) {
			var data = dataSnapshot.val();
			if (data[Resource.idAttribute]) {
				Resource.inject(data);
			}
		});
		ref.on('child_removed', function (dataSnapshot) {
			var data = dataSnapshot.val();
			if (data[Resource.idAttribute]) {
				Resource.eject(data[Resource.idAttribute]);
			}
		})
	});

});

app.service('User', function (DS) {
	return DS.defineResource('user');
});
app.service('Classroom', function (DS) {
	return DS.defineResource({
		name: 'classroom',
		hasMany: {
			users: 'users'
		}
		});
});