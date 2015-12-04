var usersFactory = angular.module('allusersfactory', [])

  .factory('allUsers', allUsers);

  allUsers.$inject = ['$http'];

    function allUsers($http){
      $http({
        method: "GET"
        ,url: "/api/users"
      })
      .then(function(data){
        console.log(data);
      })
  }
