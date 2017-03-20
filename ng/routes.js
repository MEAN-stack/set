angular.module('app')
.config(function($routeProvider) {
  $routeProvider
  .when('/practise',    {controller: 'CardsCtrl',    templateUrl: 'practise.html'})
})
