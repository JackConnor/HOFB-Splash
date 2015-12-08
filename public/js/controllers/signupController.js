angular.module('signupController', ['checkStatusFactory', 'signupUserFactory'])

  .controller('signupCtrl', signupCtrl)

  signupCtrl.$inject = ['$http', 'checkstatus', 'signupUser'];
  function signupCtrl($http, checkstatus, signupUser){
    var self = this;

    self.viewToggle = "designer";////for controller whether buyer or designer portion of page are displayed

    // console.log(checkstatus);
    // console.log(signupUser);

    /////event to sign up a new user
    $('.signupSubmit').on('click', function(){
      signupUser.signup();
      // var email = $('.signupEmail').val();
      // var password = $('.signupPassword').val();
      // $http({
      //   method: "POST"
      //   ,url: "/api/signup"
      //   ,data: {email: email, password: password}
      // })
      // .then(function(newUser){
      //   console.log(newUser);
      //   return newUser
      // })
    })

    ///////////////////////////////////////////
    /////////logic for the navbar and toggle///

    /////link to signup function
    function goToSignup(){
      if(self.viewToggle == "designer"){
        window.location.hash = "#/designer/signup"
      } else if(self.viewToggle == "buyer"){
        window.location.hash = "#/buyer/signup"
      }
    }
    ////////////link to signup event listener
    $('.signupButton').on('click', function(){
      goToSignup();
    })

    ////make links light up on hover
    $('.splashNavLinksText').on('mouseenter', function(){
      $(this).css({
          backgroundColor: "#A9E2F3"
        });
    })

    ////make links un-light up on mouseleave
    $('.splashNavLinksText').on('mouseleave', function(){
      $(this).css({
          backgroundColor: ""
        });
    })

    //////toggle to designer version
    $('.splashNavLinksText1').on('click', function(){
      if(self.viewToggle == "buyer"){
        self.viewToggle = 'designer';
        console.log(self.viewToggle);
        swapToDesigner();
      }
    })

    //////toggle to buyer version
    $('.splashNavLinksText2').on('click', function(){
      if(self.viewToggle == "designer"){
        self.viewToggle = 'buyer';
        console.log(self.viewToggle);
        swapToBuyer();
      }
    })

    ///////////////////////////////////////////
    //////////Begin Toggle Logic///////////////

    ///
    function swapToBuyer(){
      ///change image
      $('.splashBackgroundImage').attr('src', 'http://st.depositphotos.com/1037987/2504/i/950/depositphotos_25048555-Meeting-In-Fashion-Design-Studio.jpg')
      ////change instruction images
      $('.howTo1').attr('src', '/img/buyerstep.jpg');
      $('.howTo2').attr('src', '/img/buyerstep.jpg');
      $('.howTo3').attr('src', '/img/buyerstep.jpg');
      $('.howTo4').attr('src', '/img/buyerstep.jpg');
      $('.howTo5').attr('src', '/img/buyerstep.jpg');
      $('.howTo6').attr('src', '/img/buyerstep.jpg');
      self.viewToggle = "buyer";
    }

    function swapToDesigner(){
      ///change image
      $('.splashBackgroundImage').attr('src', 'http://www.allfashionstyles.com/wp-content/uploads/2015/01/Top-Fashion-Design-Schools-in-The-World.jpeg')
      ////change instruction images
      $('.howTo1').attr('src', '/img/howtofiller.jpg');
      $('.howTo2').attr('src', '/img/howtofiller.jpg');
      $('.howTo3').attr('src', '/img/howtofiller.jpg');
      $('.howTo4').attr('src', '/img/howtofiller.jpg');
      $('.howTo5').attr('src', '/img/howtofiller.jpg');
      $('.howTo6').attr('src', '/img/howtofiller.jpg');
      self.viewToggle = "designer";
    }
    ////////////End Toggle Logic///////////////
    ///////////////////////////////////////////

    /////End logic for the navbar and toggle///
    ///////////////////////////////////////////

    //////////////////////////////////////////
    /////////////Begin logic for signup page//

    /////interpolate text into signup content
    function intSignup(){
      var userType = window.location.hash.split('/')[1];
      $('.signupUserType').text(userType);
    }
    intSignup();
    /////////////End logic for signup page////
    //////////////////////////////////////////

  //////////////End signup controller////
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
