
var demoApp = angular.module('demoApp',['ngRoute'])

demoApp.config(function($routeProvider){
	$routeProvider
		.when('/view1',
			{	
				controller:'SimpleController'
				,templateUrl : 'View1.html'
			})
		.when('/view2',
			{
				controller:'SimpleController'
				,templateUrl : 'View2.html'
			})
		.otherwise({redirectTo:'/view1'});	

});

demoApp.controller('SimpleController',function($scope){
		$scope.customers = [
				{name:'Terry.Cho',city:'Seoul'},
				{name:'Cath',city:'Suwon'},
				{name:'Carry',city:'Suwon'}
		];
		
	} );


