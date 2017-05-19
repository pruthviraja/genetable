mainApp.controller('controller', ['$scope', '$http', function($scope, $http){
	var url = 'http://oncokb.org/api/v1/genes/673/variants', termArray = [], chartData = {};
	$scope.gridData = [];

	$scope.series = ['Term count'];
	$scope.labels = [];
	$scope.data = [];
	// Get the API data on page load
	$http.get(url).then(function(response) {
		var obj = {};
		
		// Populate the grid data.
		$scope.gridData = response.data;
		
		// Iterate on the data and create an object for the term vs count bar chart.
		for(var i = 0, key; (i < $scope.gridData.length); i++) {
			key = $scope.gridData[i].consequence.term;
			if(key) {
				if(!chartData[key]) {
					chartData[key] = 1
				} else {
					chartData[key]++
				}
			} else {console.log(i)}
		}
		for(var key in chartData) {
			$scope.labels.push(key);
			$scope.data.push(chartData[key]);
		}
	}, function(response) {
		console.log('Error: ' + response.data)
	});
	
}])