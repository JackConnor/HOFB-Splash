angular.module('signupUserFactory', [])

  .factory('signupUser', signupUser)

  signupUser.$inject = ['$http'];
  function signupUser($http){

    function signUp(){
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
          return newUser
        })
      } else {
        console.log('Your passwords dont match');
      }

    }

    return {signup: signUp}
  }
