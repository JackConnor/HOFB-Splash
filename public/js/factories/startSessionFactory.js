angular.module('startSessionFactory', [])

  .factory('startSession', startSession)

  startSession.$inject = ['$http'];
  function startSession($http){

    function start(email, password, callback){
      console.log('in the factory');
      console.log(email);
      console.log(password);
      $http({
        method: "POST"
        ,url: "/api/startsession"
        ,data: {email: email, password: password}
      })
      .then(function(sessionToken){
        console.log('made it?');
        console.log(sessionToken);
        console.log(sessionToken.data);
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
