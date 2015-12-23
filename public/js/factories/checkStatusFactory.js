var checkStatusFactory = angular.module('checkStatusFactory', [])

  .factory('checkstatus', checkstatus);

  checkstatus.$inject = ['$http'];
  function checkstatus($http){

    // var token = window.location.localStorage.token;
    function checkStatusFunc(token){
      return $http({
        method: "GET"
        ,url: "/api/checkstatus/"+token
      })
    }
    return checkStatusFunc;
    // .then(function(data){
    //   self.data = data;
    //   return data;
    // })
  }
