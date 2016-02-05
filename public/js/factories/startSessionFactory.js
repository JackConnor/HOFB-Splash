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
        var tokenStatus = sessionToken.data;
        if(tokenStatus == "no user"){
          alert('we cannot find that user, please try again');
        }
        else if(tokenStatus == "password incorrect"){
          console.log('wrong pw');
          alert('password incorrect, please try again');
        }
        else{
          window.localStorage.hofbToken = sessionToken.data;
          callback(sessionToken.data);
        }
      })
    }
    return {
      startSession: start
    }
    // return 5555;
  }
