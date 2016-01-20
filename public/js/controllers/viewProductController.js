angular.module('viewProductController', ['checkPwFactory', 'getProductFactory', 'checkStatusFactory', 'singleuserfactory', 'getSwatchesFactory'])

  .controller('viewProductCtrl', viewProductCtrl)

  viewProductCtrl.$inject = ['$http', 'checkPw', 'getProduct', 'checkstatus', 'singleUser', 'allSwatches'];
  function viewProductCtrl($http, checkPw, getProduct, checkstatus, singleUser, allSwatches){
    var self = this;
    self.test=('self test');
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    //Product Id
    var productId = window.location.hash.split('/')[3];

    // Submit comment button wiring
    $(".commentSubmitBtn").on('click', function(){
      addProductComment();
    });
    setTimeout(function(){
      $('#commentTextBox').animate({
        scrollTop: $('#commentTextBox')[0].scrollHeight
      }, 500)
    }, 500)

    //function to collect and post comment
    function addProductComment() {
      // var targetFormId = $(this).attr('data-formId');
      // var targetForm = $(targetFormId);
      var newCommentId = $(productId)
      var newCommentSender = self.currentUser.email
      var newCommentMessage = $('.message').val();

      var myData = {
          productId: window.location.hash.split('/')[3],
          sender: newCommentSender,
          commentText: newCommentMessage,
      };
      self.allComments.push(myData)
      self.test=(myData);
      $http({
        method: "POST"
        ,url: "/api/conversation"
        ,data: myData
      })
      .then(function(data){
        $('#commentTextBox').animate({
          scrollTop: $('#commentTextBox')[0].scrollHeight
        }, 500)
      })
    }

    var productId = window.location.hash.split('/')[3];////grab the id of the data in order to prepopulate the page

    // logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/designer/loginportal"
    })



    //Get request for ALL product comments
    var windowStuff = window.location;
    var productIdFromURl = window.location.hash;
    var productIdUrlArray = window.location.hash.split('/');
    var productId = window.location.hash.split('/')[3];

    function getProductComments(){
      $http({
       method:'GET'
       ,url:'/api/conversation/'+ productId
      })
      .then(function(data){
        console.log(data.data.comments);
        self.allComments=(data.data.comments);
      })
    }
    getProductComments();

    lastCommentBoxColor = function(){
    }

    //////////////////////////////////////////
    //////////logic to populate page on load//
    getProduct(window.location.hash.split('/')[3])
      .then(function(productData){
        self.productData = productData.data;
        console.log(self.productData);
        populatePage();
      });
    function populatePage(){
      checkstatus(window.localStorage.hofbToken)
        .then(function(decodedToken){
          self.tokenData = decodedToken.data
          singleUser(decodedToken.data.name)
            .then(function(user){
              self.currentUser = user.data;
              popContent();
              popSwatches();
              popImages();
            })
        })
      }
    function unique(list) {
      var result = [];
      $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
      });
      return result;
    }
    function popContent(){
      // $('.viewProductTypeData').text(self.productData.productType);
      // $('.viewProductDescription').text(self.productData.description);
      $('.viewProductCreator').text(self.currentUser.email)
      $('.viewProductName').text(self.productData.name)
    }

    function popSwatches(){
      ////get all colors
      var colorArrayFunc = function(){
        var prodfabrics = self.productData.fabrics;
        console.log(prodfabrics);
        var colorArr = [];
        for (var i = 0; i < prodfabrics.length; i++) {
          for (var j = 0; j < prodfabrics[i].colors.length; j++) {
            colorArr.push(prodfabrics[i].colors[j]);
          }
        }
        console.log(colorArr);
        var colorArr = unique(colorArr)
        console.log(colorArr);
        var colorList = [];
        for (var i = 0; i < colorArr.length; i++) {
          console.log(allSwatches.colors[colorArr[i]]);
          colorList.push(allSwatches.colors[colorArr[i]])
        }
        return colorList;
      }
      self.allColors = colorArrayFunc();
      //////get all fabrics
      var fabricArrayFunc = function(){
        var fabricArr = [];
        if(self.productData.fabrics.length){
          for (var i = 0; i < self.productData.fabrics.length; i++) {
            var fabric = self.productData.fabrics[i].name.toLowerCase();
            // console.log(allSwatches.color[prodcolors[i].toLowerCase]);
            fabricArr.push(allSwatches.fabrics[fabric].url);
          }
          console.log(fabricArr);
          return fabricArr;
        }
      }
      self.allFabrics = fabricArrayFunc();
    }

    function popImages(){
      self.allImages = self.productData.images;
      self.allThumbs = self.productData.thumbnails;
      loadThumbs();
    }

    function addPhotoModal(){
      $('.viewProductImage').on('click', function(){
        $('.bodyview').prepend(
          '<div class="invisModal">'+
            "<div class='viewProductModalShowPhotos'>"+
              '<img class="viewProductModalImage" src="'+self.allImages[0]+'"/>'+
              '<div class="viewProductModalMiniHolder">' +
              '</div>'+
              '<div class="viewProductModalMiniHolder1">' +
              '</div>'+
            '</div>'+
          '</div>'
        )
        ///////function to close the modal
        $('.invisModal').on('click', function(evt){
          var elClass = $(evt.target)[0].classList[0];
          console.log(elClass);
          if(elClass == 'invisModal'){
            $('.'+elClass).remove();
          }
        })
        /////now we append the mini photos
        for (var i = 0; i < self.allImages.length; i++) {
          if(i <= 4){
            $('.viewProductModalMiniHolder').append(
              "<div class='viewProductModalMiniCell'>"+
                "<img class='viewProductModalMiniCellImage' src='"+self.allThumbs[i]+"'>"+
              '</div>'
            )
          }
          else {
            $('.viewProductModalMiniHolder1').append(
              "<div class='viewProductModalMiniCell'>"+
                "<img class='viewProductModalMiniCellImage' src='"+self.allThumbs[i]+"'>"+
              '</div>'
            )
          }
        }
        $('.viewProductModalMiniCellImage').on('click', function(evt){
          var source = $(evt.target).attr('src');
          console.log(source);
          $('.viewProductModalImage').attr('src', source);
        })
      })
    }
    addPhotoModal();
    //////////logic to populate page on load//
    //////////////////////////////////////////

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
    //////navbar click events
    $('.navTitle').on('click', function(){
      window.location.hash = "#/designer/dashboard";
    });
    $('#navBarEnvelopeIcon').on('click', function(){
      ///////////////////////////////////
      ///////messages temporary popup///
      $('.bodyview').prepend(
          "<div class='messageMessageContainer'>"+
            "<h3>Coming Soon</h3>"+
            "<div class='messageMessageDescription'>"+
              "<h4>Feedback on your designs is an important part of your experience at HOFB. We are in the process of providing a platform for real communication with our professional fashion experts, please check back soon."+
            "</div>"+
            "<div class='messageMessageButton'>"+
              "BACK TO HOFB"+
            "</div>"+
          "</div>"
      )
      // window.location.hash = "#/messages";
      $('body').keypress(function(evt){
        if($('.messageMessageContainer') && $(evt)[0].charCode == 13){
          $('.messageMessageContainer').remove();
        }
      });
      $('.messageMessageButton').on('click', function(){
        $('.messageMessageContainer').remove();
      })
    })

    /////start of navbar dropdown logic/////////////
    ////////////////////////////////////////////////
    $(".dropbtn").on('click', function(){
      console.log('dropbtn is working');
            myFunction();
            // location.reload();
      });

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
    /////end of navbar dropdown logic/////////////
    ////////////////////////////////////////////////

    $('.tempMessagesImage').on('mouseenter', function(){
      console.log('entered');
      $(this).css({
        border: "3px solid green"
      })
    })
    $('.tempMessagesImage').on('mouseleave', function(){
      $('.tempMessagesImage').css({
        border: ""
      })
    })
    $('.tempMessagesImage').on('click', function(){
      ///////////////////////////////////
      ///////messages temporary popup///
      $('.bodyview').prepend(
          "<div class='messageMessageContainer'>"+
            "<h3>Coming Soon</h3>"+
            "<div class='messageMessageDescription'>"+
              "<h4>Feedback on your designs is an important part of your experience at HOFB. We are in the process of providing a platform for real communication with our professional fashion experts, please check back soon."+
            "</div>"+
            "<div class='messageMessageButton'>"+
              "BACK TO HOFB"+
            "</div>"+
          "</div>"
      )
      // window.location.hash = "#/messages";
      $('body').keypress(function(evt){
        if($('.messageMessageContainer') && $(evt)[0].charCode == 13){
          $('.messageMessageContainer').remove();
        }
      });
      $('.messageMessageButton').on('click', function(){
        $('.messageMessageContainer').remove();
      })
    })
  /////end viewProduct controller
  ////////////////////////
  ////////////////////////
  }
