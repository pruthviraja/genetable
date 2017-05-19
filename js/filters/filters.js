// Returns an array with the next set of data.
mainApp.filter('startFrom', function() {
    return function(input, start) {
        return input.slice(start);
    }
});