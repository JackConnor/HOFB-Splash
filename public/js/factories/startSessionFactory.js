angular.module('startSessionFactory', [])

  .factory('startSession', startSession)

  startSession.$inject = ['$http'];
  function startSession($http){

    function start(email, password){
      console.log('in the favtory');
      console.log(email);
      console.log(password);
      $http({
        method: "POST"
        ,url: "/api/startsession"
        ,data: {email: email, password: password}
      })
      .then(function(sessionToken){
        console.log(sessionToken);
        console.log(sessionToken.data);
        if(sessionToken.data.data == "sorry no token"){
          alert('name or password were incorrect');
        }
        else{
          window.localStorage.hofbToken = sessionToken.data;
        }
      })
    }
    return {
      startSession: start
    }
    // return 5555;
  }
