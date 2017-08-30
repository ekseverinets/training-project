var myApp = angular.module('myApp', ["ngRoute"]);

myApp.config(function($routeProvider) {
  $routeProvider.when("/login", {
    templateUrl : "templates/login.html"
  });
  $routeProvider.when("/contactlist", {
    templateUrl : "templates/contactlist.html"
	});
	$routeProvider.otherwise({
		redirectTo: "/login"
	});
});



