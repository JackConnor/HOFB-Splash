angular.module('signupUserFactory', [])

  .factory('signupUser', signupUser)

  signupUser.$inject = ['$http'];
  function signupUser($http){

    function signUp(callback){
      var email = $('.signupEmail').val();
      var password = $('.signupPassword').val();
      var rePassword = $('.signupPasswordRepeat').val()
      if(password == rePassword){
        $http({
          method: "POST"
          ,url: "/api/signup"
          ,data: {email: email, password: password}
        })
        .then(function(newUser){
          console.log(newUser);
          callback();
        })
      } else {
        console.log('Your passwords dont match');
      }

    }

    return {signup: signUp}
  }
