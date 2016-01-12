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
          // location.reload();
    });
// Update user password button wiring
  $(".userProfileChangePw").on('click', function(){
    console.log('Update PW button is working');
    updateUserProfilePassword();
    });
// user profile photo upload
$(".userProfileImageFileUpload").on('change', function (){
  console.log('profile upload on change is working');
  console.log($(".userProfileImageFileUpload"));
  });

  /////collect email for password verification email
  $('.userProfileChangePw').on('click', function(){
    var emailAddress = $('#userProfileEmail').val();
    console.log(emailAddress);
    var date = new Date();
    console.log(date);
    postPasswordVericationEmail({email: emailAddress, date: date});
  })


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
        // newForm();
      })
      if (status = '200'){
        alert('Your profile has been updated')
      }
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
    var pass1 = $('.inputPassword').val();
    var pass2 = $('.inputPasswordConfirm').val();
    console.log(pass1);
    console.log(pass2);
    if(pass1 == pass2){
      var checkedPassword = checkPassword(pass1);
      if (checkedPassword){
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
      else{
        alert('Minimum of 6 characters - No special characters in password, please re-enter your password and try again.')
      }
    }
    else{
      alert('Please make sure your passwords match');
    }
    if (status = '200'){
      alert('Your password is now updated')
    }
}

/////////////post for password verification email////////////////
function postPasswordVericationEmail(userEmailInfo){
  console.log(userEmailInfo);
  $http({
    method: "POST"
    ,url: "/api/email/password"
    ,data: {email: userEmailInfo.email, date: userEmailInfo.date}
  })
  .then(function(email){
    $http({
      method: "POST"
      ,url: "/api/sendemail"
      ,data: {email: email.data.email}
    })
    .then(function(email){
      alert('password verification link has been sent to your email')
    })
  })
}



//////////////multer form///////////////
//////////////////////////////////////
function newForm(){
  $('.bodyview').append(
    "<form class='tempForm' action='/api/profile/pictures' method='POST' enctype='multipart/form-data'>"+
    "</form>"
  )
  $('.tempForm').append($('#userProfileImageFileUpload')[0]);
  $('.tempForm').append(
    "<input name='userId' type='text' value='"+userProfileHashData+"'>"
  );
  console.log('.tempForm');
  $('.tempForm').submit(function(){
    console.log('submitted');
  });
}
// $(".userProfileSubmitBtn").on('click', newForm)
///////////end of multer form/////////////
//////////////////////////////////////



  ////////end userProfile controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
