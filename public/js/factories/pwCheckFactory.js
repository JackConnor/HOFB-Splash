angular.module('checkPwFactory', [])

  .factory('checkPw', checkPw);

  checkPw.$inject = ['$http'];
  function checkPw($http){

    function checkPass(){
      console.log('were doing it');
      console.log(window.localStorage.checkPw);
      console.log(window.localStorage);
      if(window.localStorage.checkPw || window.localStorage.checkPw == false){
        $('.bodyview').prepend(
          '<div class="photoModal">'+
            "<input class='pwCheck' placeholder='Password'>"+
            "<input type='button' class='pwSubmit' value='send pw'>"+
          '</div>'
        );
        $('.pwSubmit').on('click', function(){
          var pwChecker = $('.pwCheck').val();
          $http({
            method: "POST"
            ,url: "/api/checkpassword/production"
            ,data: {password: pwChecker}
          })
          .then(function(verifier){
            if(verifier){
              window.localStorage.checkPw = true;
              $('.photoModal').remove();
            }
          })
        })
      }
    }
    return {
      checkPassword: checkPass
    }
  }
