angular.module('signupUserFactory', [])

  .factory('signupUser', signupUser)

  signupUser.$inject = ['$http'];
  function signupUser($http){

    function signUp(callback, pw, status){
      var email = $('.signupEmail').val();
      var password = pw
      var rePassword = pw
      var status = status;
      $http({
        method: "POST"
        ,url: "/api/signup"
        ,data: {email: email, password: password, status: status}
      })
      .then(function(newUser){
        console.log(newUser);
        callback(email, password);
      })
    }
    return {signup: signUp}
  }
