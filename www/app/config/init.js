// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ui.router', 'js-data', 'firebase'])

app.config(function (DSFirebaseAdapterProvider, DSProvider) {
	DSFirebaseAdapterProvider.defaults.basePath = 'https://discoapp.firebaseio.com';

	angular.extend(DSProvider.defaults, {
		beforeCreate: function (resource, data, cb) {
			if (resource.defaultAdapter === 'firebase') {
				data = fixKeys(data, true);
			}
			cb(null, data);
		},
		beforeUpdate: function (resource, data, cb) {
			if (resource.defaultAdapter === 'firebase') {
				data = fixKeys(data, true);
			}
			cb(null, data);
		},
		afterCreate: function (resource, data, cb) {
			if (resource.defaultAdapter === 'firebase') {
				data = fixKeys(data, false);
			}
			cb(null, data);
		},
		afterUpdate: function (resource, data, cb) {
			if (resource.defaultAdapter === 'firebase') {
				data = fixKeys(data, false);
			}
			cb(null, data);
		},
		afterFind: function (resource, data, cb) {
			if (resource.defaultAdapter === 'firebase') {
				data = fixKeys(data, false);
			}
			cb(null, data);
		},
		afterFindAll: function (resource, data, cb) {
			if (resource.defaultAdapter === 'firebase') {
				if (!Array.isArray(data)) {
					data = fixKeys(data, false);
				} else {
					data = data.map(function (d) {
						return fixKeys(d, false);
					})
				}
			}
			cb(null, data);
		},
		});
});

app.run(function ($ionicPlatform, $rootScope, DS, DSFirebaseAdapter, User) {
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

	//DS.adapters.firebase === DSFirebaseAdapter;
	angular.forEach(DS.definitions, function (Resource) {
				if (Resource.defaultAdapter !== 'firebase') return;
				var ref = DSFirebaseAdapter.ref.child(Resource.endpoint);
				// Inject items into the store when they're added to Firebase
				// Update items in the store when they're modified in Firebase
				ref.on('child_changed', function (dataSnapshot) {
			var data = dataSnapshot.val();
			if (data[Resource.idAttribute]) {
				Resource.inject(fixKeys(data));
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

	// 	$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
	// 	AuthService.authMember();
	// });

	DS.registerAdapter('firebase',
		DSFirebaseAdapter,
		{ default: true });
});

app.factory('User', function (DS) {
	return DS.defineResource({
		name: 'users'
		});
});
app.factory('Classroom', function (DS) {
	return DS.defineResource({
		name: 'classrooms'
	});
});

function fixKeys(obj, encode) {
		if (!Array.isArray(obj) && typeof obj != 'object') return obj;
		return Object.keys(obj).reduce(function (acc, key) {
			var fixedKey = key;
			if (encode) {
				fixedKey = encodeAsFirebaseKey(fixedKey);
			} else {
				fixedKey = decodeFirebaseKey(fixedKey);
			}
			acc[fixedKey] = fixKeys(obj[key], encode);
			return acc;
		}, Array.isArray(obj) ? [] : {});
	}

	function encodeAsFirebaseKey(val) {
		return val
			.replace(/\%/g, '%25')
			.replace(/\./g, '%2E')
			.replace(/\#/g, '%23')
			.replace(/\$/g, '%24')
			.replace(/\//g, '%2F')
			.replace(/\[/g, '%5B')
			.replace(/\]/g, '%5D');
	};

	function decodeFirebaseKey(val) {
		return val
			.replace(/\%25/g, '%')
			.replace(/\%2E/g, '.')
			.replace(/\%23/g, '#')
			.replace(/\%24/g, '$')
			.replace(/\%2F/g, '/')
			.replace(/\%5D/g, ']')
			.replace(/\%5B/g, '[')
	};