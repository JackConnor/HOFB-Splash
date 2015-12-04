var app = angular.module('emailController', ['allusersfactory', 'singleuserfactory', 'newuserfactory', 'newemailfactory'])

  .controller('emailCtrl', emailCtrl)

  emailCtrl.$inject = ['$http', 'allUsers', 'singleUser', 'newUser', 'newEmail']
  function emailCtrl($http, allUsers, singleUser, newUser, newEmail){
    var self = this;
    console.log('ououououo');

    ///////get all users
    console.log(allUsers());

    //////use factory to search a single user
    var url = "5660e162312d9bf1f2d2dce6";
    console.log(singleUser(url));

    /////post a new user
    var newUserData = {firstname: "trinity", password: "password"}
    console.log(newUser(newUserData));

    /////collect all of our emails on splash page
    $('.collectEmail').on('click', function(){
      var emailAddress = $('.emailInput').val();
      newEmail(emailAddress)
    })

  ////////end email controller//////
  ////////////////////////////////////
  ////////////////////////////////////
  }
