angular.module('adminCurateController', [])

  .controller('adminCurateCtrl', adminCurateCtrl)

  adminCurateCtrl.$inject = ['$http'];
  function adminCurateCtrl($http){
    var self = this;



    function loadThumbs(){
      console.log(self.allImages);
      for (var i = 0; i < self.allThumbs.length; i++) {
        $('.viewProductMiniHolder').append(
          '<div class="viewMiniCell" >'+
            "<img class='viewMiniImage' id='"+self.allImages[i]+"' src='"+self.allThumbs[i]+"' />"+
          "</div>"
        )
      }
      $('.viewMiniImage').on('click', function(evt){
        var bigSource = $(evt.target)[0].id;
        console.log(bigSource);
        $(".viewProductImageMain").attr('src', bigSource);
        for (var i = 0; i < $('.viewMiniImage').length; i++) {
          $($('.viewMiniImage')[i]).css({
            outline: ''
          })
        }
        $(evt.target).css({
          outline: "3px solid #999999"
        })
      })
    }

    // logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/designer/loginportal"
    })
  ////////end adminCurate controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
