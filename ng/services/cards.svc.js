angular.module('app')
.service('CardsSvc', function($http) {

  this.fetch = function() {
    return $http.get('/api/cards')
  }
})
