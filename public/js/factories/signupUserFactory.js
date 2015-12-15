angular.module('signupUserFactory', [])

  .factory('signupUser', signupUser)

  signupUser.$inject = ['$http'];
  function signupUser($http){

    function signUp(callback, pw){
      var email = $('.signupEmail').val();
      console.log(email);
      var password = pw
      console.log(password);
      var rePassword = pw
      $http({
        method: "POST"
        ,url: "/api/signup"
        ,data: {email: email, password: password}
      })
      .then(function(newUser){
        console.log(newUser);
        callback(email, password);
      })
    }
    return {signup: signUp}
  }
