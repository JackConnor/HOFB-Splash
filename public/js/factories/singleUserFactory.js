angular.module('singleuserfactory', [])

  .factory('singleUser', singleUser)

  singleUser.$inject = ['$http'];
  function singleUser($http){
    function singleUserCall(userId){
      return $http({
        method: "GET"
        ,url: "/api/users/"+userId
      })
      // .then(function(data){
      //   self.data = data;
      //   return data;
      // })
    }

    return singleUserCall;
  }
