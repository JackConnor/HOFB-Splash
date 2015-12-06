angular.module('signupController', [])

  .controller('signupCtrl', signupCtrl)

  signupCtrl.$inject = ['$http'];
  function signupCtrl($http){
    var self = this;

    self.userToggle = true;////for controller whether buyer or designer portion of page are displayed

    ///////////////////////////////////////////
    /////////logic for the navbar and toggle///

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

    //////toggle to buyer version
    $('.splashNavLinksText2').on('click', function(){
      console.log(self.userToggle);
      
    })

    /////End logic for the navbar and toggle///
    ///////////////////////////////////////////

  //////////////End signup controller////
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
