angular.module('startSessionFactory', [])

  .factory('startSession', startSession)

  startSession.$inject = ['$http'];
  function startSession($http){

    // function start(){
    //   var email = $('.signupEmail');
    //   $http({
    //     method: "POST"
    //     ,url: "/api/startsession"
    //     ,data: {email: email}
    //   })
    //   .then(function(sessionToken){
    //     console.log(sessionToken);
    //     window.location.jwtToken = sessionToken;
    //   })
    // }
    //
    // return {
    //   startSession: start
    // }
    return 5555;
  }
