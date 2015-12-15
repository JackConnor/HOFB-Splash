angular.module('startSessionFactory', [])

  .factory('startSession', startSession)

  startSession.$inject = ['$http'];
  function startSession($http){

    function start(email, password){
      $http({
        method: "POST"
        ,url: "/api/startsession"
        ,data: {email: email, password: password}
      })
      .then(function(sessionToken){
        console.log(sessionToken);
        window.localStorage.hofbToken = sessionToken;
      })
    }
    return {
      startSession: start
    }
    return 5555;
  }
