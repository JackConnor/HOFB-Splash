angular.module('startSessionFactory', [])

  .factory('startSession', startSession)

  startSession.$inject = ['$http'];
  function startSession($http){

    function start(email, password, callback){
      $http({
        method: "POST"
        ,url: "/api/startsession"
        ,data: {email: email, password: password}
      })
      .then(function(sessionToken){
        console.log(sessionToken.data);
        window.localStorage.hofbToken = sessionToken.data;
        callback();
      })
    }
    return {
      startSession: start
    }
    // return 5555;
  }
