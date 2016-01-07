angular.module('userProfileController', ['singleuserfactory'])

  .controller('userProfileCtrl', userProfileCtrl)

  userProfileCtrl.$inject = ['$http', 'singleUser'];
  function userProfileCtrl($http, singleUser){
    var self = this;

    singleUser('568c3b81be426e0ad0bd5248')
    .then(function (user){
      console.log(user);
      self.user = user
    }
  )

  // User profile update button wiring
  $(".userProfileSubmitBtn").on('click', function(){
    console.log('Update button is working');
          updateUserProfile();
    });

var userProfileHashData = window.location.hash.split('/')[3];////grab the id of the data in order to prepopulate the page

    function updateUserProfile() {
      var userProfileId = $(userProfileHashData)
      var userFirstName = $('.userProfileFirstName').val();
      var userLastName = $('.userProfileLastName').val();
      var userProfileLocation = $('.userProfileLocation').val();
      var userBio = $('.userProfileBio').val();
      var userEmail = $('.userProfileEmail').val();

      var userData = {
        firstname:userFirstName,
        lastname:userLastName,
        location:userProfileLocation,
        bio:userBio,
        email:userEmail,
      };
      console.log(userData);
      self.test=(userData);
      $http({
        method: "POST"
        ,url: "/api/user/profile"
        ,data: userData
      })
      .then(function(data){
        console.log(data);
      })
    }



  ////////end userProfile controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
