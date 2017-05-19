/**
*	The grid directive renders all the records in a tabular format.
*/
mainApp.directive('grid', ['$filter', function($filter) {
		return {
			restrict: 'E',
			scope: {
				gridData: '='
			},
			template: 	'<div class="margin10">' +
							'<input type="radio" ng-model="option.name" value="alteration"><span>Alteration</span> ' +
							'<input type="radio" ng-model="option.name" value="gene.hugoSymbol"><span>Hugo Symbol</span> ' +
							'<input type="radio" ng-model="option.name" value="gene.entrezGeneId"><span>Entrez Gene Id</span> ' +
						'</div>' +
						'<div class="margin10">' + 
							'<span class="capitalize search-span">Search(By {{option.name.replace("gene.", "")}}): </span>' + 
							'<input type="text" ng-model="search"/>' +
						'</div>' +
						'<table ng-if="gridData.length > 0" class="table table-bordered table-hover">' +
							'<thead>' +
								'<tr>' +
									'<th>Alteration</th>' +
									'<th>Hugo Symbol</th>' +
									'<th>Entrez Gene Id</th>' +
									'<th>OncoGene/TSG</th>' +
								'</tr>' +
							'</thead>' +
							'<tbody>' +
								'<tr ng-repeat="row in gridData | startFrom: currentPage*pageSize | limitTo: pageSize">' +
									'<td>{{row.alteration}}</td>' +
									'<td>{{row.gene.hugoSymbol}}</td>' +
									'<td>{{row.gene.entrezGeneId}}</td>' +
									'<td>{{row.gene.oncogene || row.gene.tsg}}</td>' +
								'</tr>' +
							'</tbody>' +
						'</table>' +
						'<div ng-if="gridData.length === 0" class="text-danger margin10">No records found.</div>' +
						'<button ng-disabled="currentPage === 0" ng-click="currentPage=currentPage-1">Previous</button>' +
				        ' {{(numberOfPages() !== 0) ? (currentPage + 1) : 0}}/{{numberOfPages()}} ' +
				        '<button ng-disabled="currentPage >= getData().length/pageSize - 1" ng-click="currentPage = currentPage + 1">Next</button>',
			link: function (scope, element, attrs) {
				scope.pageSize = 10;
				scope.currentPage = 0;
				scope.search = '';
				scope.dataCopy = angular.copy(scope.gridData);
				
				scope.option = {name: 'gene.entrezGeneId'};

				// Needed for the pagination calculation.
				scope.getData = function () {
					return $filter('filter')(scope.gridData, createObjFromRadioValue(scope.search))
			    }
				
				// Returns the number of pages.
			    scope.numberOfPages = function(){
			        return Math.ceil(scope.getData().length / scope.pageSize);                
			    }
			    
			    // Listen for changes to the search box value and filter the grid data based on the selected radio button's value.
			    scope.$watch('search', function(newValue, oldValue) {
					scope.gridData = $filter('filter')(scope.dataCopy, createObjFromRadioValue(newValue));
				}, false);
			    
			    // Listen for changes to the radio value and reset the currentpage.
			    scope.$watch('option.name', function(newValue, oldValue) {
			    	scope.currentPage = 0;
				}, false);
			    
			    // Creates an object for the filter function.
			    var createObjFromRadioValue = function(value) {
			    	var obj, radioValue = scope.option.name.split('.');
			    	for(var i = (radioValue.length - 1); i >= 0; i--) {
			    		obj = {};
			    		obj[radioValue[i]] = value;
			    		value = obj;
			    	}
					return obj
			    }
			}
		}
}]);