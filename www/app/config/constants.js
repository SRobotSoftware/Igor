angular
	.module('Disco')
	.constant('CONSTANTS', (function() {
		var root = 'https://discoapp.firebaseio.com/';
		return {
			fbRef: root,
		};
	} ()));