angular
	.module('Disco', [
		'ui.router',
		'js-data',
		'firebase'
		])
		.config(function(DSFirebaseAdapterProvider, DSProvider) {
		DSFirebaseAdapterProvider.defaults.basePath = 'https://discoapp.firebaseio.com';
	})
	.run(function($rootScope, DS, DSFirebaseAdapter, model) {

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
			ref.on('child_changed', function(dataSnapshot) {
				var data = dataSnapshot.val();
				if (data[Resource.idAttribute]) {
					Resource.inject(data);
				}
			});
			// Eject items from the store when they're removed from Firebase
			ref.on('child_removed', function(dataSnapshot) {
				var data = dataSnapshot.val();
				if (data[Resource.idAttribute]) {
					Resource.eject(data[Resource.idAttribute]);
				}
			});
		});

	})
	.factory('model', model);

function model(DS) {
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
};