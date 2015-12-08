angular.module('signupUserFactory', [])

  .factory('signupUser', signupUser)

  signupUser.$inject = ['$http'];
  function signupUser($http){

    function signUp(){
      var email = $('.signupEmail').val();
      var password = $('.signupPassword').val();
      $http({
        method: "POST"
        ,url: "/api/signup"
        ,data: {email: email, password: password}
      })
      .then(function(newUser){
        console.log(newUser);
        return newUser
      })
    }

    return {signup: signUp}
  }
