app.controller('LoginController', function (UserService) {
	// Vars
	var vm = this;

	// Functions
	vm.login = function () {
		UserService.login();
	};
});