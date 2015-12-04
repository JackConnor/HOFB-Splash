angular.module('newuserfactory', [])

  .factory('newUser', newUser)

  newUser.$inject = ['$http'];
  function newUser($http){

    function singleUserCall(userInfo){
      return $http({
        method: "POST"
        ,url: "/api/users"
        ,data: userInfo
      })
      .then(function(data){
        self.data = data;
        return data;
      })
    }

    return singleUserCall;

  }
