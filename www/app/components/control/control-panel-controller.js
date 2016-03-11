angular
	.module('Disco')
	.controller('ControlPanelController', ControlPanelController);

function ControlPanelController($rootScope, $scope, model) {

	var User = model.user;
	var myAuth;
	if ($rootScope.authData) {
		myAuth = $rootScope.authData.uid;
	} else {
		$state.go('login');
	}
	var vm = this;

	User.find(myAuth).then(load);

	function load(user) {
		vm.user = user;
		$scope.loaded = true;
	}


}