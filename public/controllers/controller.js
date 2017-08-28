var myApp = angular.module('myApp',[]);
myApp.controller('AppCtrl',['$scope', '$http', function($scope, $http) {
	console.log("Hello World from Controller");

	var refresh = function() {
		$http.get('/contactlist').then(function(response) {
			console.log("I got the data");
			$scope.contactlist = response.data;
			$scope.contact = {};
		});
	};

	refresh();
	
	$scope.addContact = function() {
		console.log($scope.contact);
		$http.post('/contactlist', $scope.contact).then(function(response) {
			console.log(response.data);
			refresh();
		});
	};

	$scope.remove = function(id) {
		console.log(id);
		$http.delete('/contactlist/' + id).then(function(response) {
			refresh();
		});
	};

	$scope.edit = function(id) {
		console.log(id);
		$http.get('/contactlist/' + id).then(function(response) {
			$scope.contact = response.data;
		});
	};

	$scope.update = function() {
		console.log($scope.contact._id);
		$http.put('/contactlist/' + $scope.contact._id, $scope.contact).then(function(response) {
			refresh();
		});
	};

	$scope.deselect = function() {
		$scope.contact = "";
	};

}]);

