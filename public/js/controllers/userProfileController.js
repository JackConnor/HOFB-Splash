angular.module('userProfileController', ['singleuserfactory'])

  .controller('userProfileCtrl', userProfileCtrl)

  userProfileCtrl.$inject = ['$http', 'singleUser'];
  function userProfileCtrl($http, singleUser){
    var self = this;

//grabs userId from URL
    var userProfileHashData = window.location.hash.split('/')[2];////grab the id of the data in order to prepopulate the page

//test userId with all data, except image - 568c3b81be426e0ad0bd5248
    singleUser(userProfileHashData)
    .then(function (user){
      console.log(user);
      self.user = user
    }
  )

  // User profile update button wiring
  $(".userProfileSubmitBtn").on('click', function(){
    console.log('Update button is working');
          updateUserProfile();
          location.reload();
    });
// Update user password button wiring
  $(".userProfileChangePw").on('click', function(){
    console.log('Update PW button is working');
    updateUserProfilePassword();
    });




    function updateUserProfile() {
      var userProfileId = $(userProfileHashData)
      console.log(userProfileId);
      var userFirstName = $('#userProfileFirstName').val();
      console.log($('#userProfileFirstName'));
      var userLastName = $('#userProfileLastName').val();
      var userProfileLocation = $('#userProfileLocation').val();
      var userBio = $('#userProfileBio').val();
      var userEmail = $('#userProfileEmail').val();

      var userData = {
        firstname:userFirstName,
        lastname:userLastName,
        location:userProfileLocation,
        bio:userBio,
        email:userEmail,
        userId: userProfileId.selector,
      };
      console.log(userData);
      self.test=(userData);
      $http({
        method: "POST"
        ,url: "/api/users/update"
        ,data: userData
      })
      .then(function(data){
        console.log(data);
      })
    }

    function checkPassword(password){
        var pattern = /^[a-zA-Z0-9_-]{6,15}$/;
        if(pattern.test(password)){
            return true;
        }else{
            return false;
        }
    }

function updateUserProfilePassword(){
  console.log('on click works');
    var pass1 = $('.inputPassword').val();
    var pass2 = $('.inputPasswordConfirm').val();
    console.log(pass1);
    console.log(pass2);
    if(pass1 == pass2){
      checkPassword(pass1);
      console.log(checkPassword);
      if (true){
        var pwHash = pass1
        var userProfileId = $(userProfileHashData);
        var userPwData ={
          passwordDigest:pwHash,
          userId: userProfileId.selector,
        }
        console.log(userPwData);
        self.test=(userPwData);
        $http({
          method: "POST"
          ,url: "/api/users/update"
          ,data: userPwData
        })
        .then(function(data){
          console.log(data);
        })
      }
    }
    else{
      alert('Please make sure your passwords match');
    }
}

  ////////end userProfile controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
