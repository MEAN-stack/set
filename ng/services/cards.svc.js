angular.module('app')
.service('CardsSvc', function($http) {

  /**
   * 
   * @returns http promise
   */
  this.fetch = function() {
    return $http.get('/api/cards')
  }
})
