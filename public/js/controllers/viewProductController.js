angular.module('viewProductController', ['checkPwFactory', 'getProductFactory', 'checkStatusFactory', 'singleuserfactory', 'getSwatchesFactory'])

  .controller('viewProductCtrl', viewProductCtrl)

  viewProductCtrl.$inject = ['$http', 'checkPw', 'getProduct', 'checkstatus', 'singleUser', 'allSwatches'];
  function viewProductCtrl($http, checkPw, getProduct, checkstatus, singleUser, allSwatches){
    var self = this;
    console.log('viewProductController is working');
    self.test=('self test');
    window.localStorage.checkPw = false;
    checkPw.checkPassword();
    //Product Id
    var productId = window.location.hash.split('/')[3];

    // Submit comment button wiring
    $(".commentSubmitBtn").on('click', function(){
      console.log('Submit comment button is working');
            addProductComment();
      });

//function to collect and post comment
    function addProductComment() {
      // var targetFormId = $(this).attr('data-formId');
      // var targetForm = $(targetFormId);
      var newCommentId = $(productId)
      var newCommentSender = $('.sender').val();
      var newCommentMessage = $('.message').val();

      var myData = {
          sender: newCommentSender,
          commentText: newCommentMessage,
      };
      console.log(myData);
      self.test=(myData);
      $http({
        method: "POST"
        ,url: "/api/product/comment"
        ,data: myData
      })
      .then(function(data){
        console.log(data);
      })
    }

    var productId = window.location.hash.split('/')[3];////grab the id of the data in order to prepopulate the page

    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin"
    })

    //Get request for ALL product comments
    function getProductComments(){
      $http({
       method:'GET'
       ,url:'/api/view/product'
      })
      .then(function(data){
        console.log(data);
        self.allComments=(data.data);
      })
    }
    getProductComments();

    lastCommentBoxColor = function(){
      console.log('commentbox color test is working');
    }

    //////////////////////////////////////////
    //////////logic to populate page on load//
    getProduct(window.location.hash.split('/')[3])
      .then(function(productData){
        self.productData = productData.data;
        populatePage();
      });
    function populatePage(){
      checkstatus(window.localStorage.hofbToken)
        .then(function(decodedToken){
          console.log(decodedToken);
          self.tokenData = decodedToken.data
          singleUser(decodedToken.data.name)
            .then(function(user){
              console.log(user);
              self.currentUser = user.data;
              popContent();
              popSwatches();
              popImages();
            })
        })
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
        var prodcolors = self.productData.colors;
        console.log(prodcolors);
        var colorArr = [];
        for (var i = 0; i < prodcolors.length; i++) {
          var prod = prodcolors[i].toLowerCase();
          // console.log(allSwatches.color[prodcolors[i].toLowerCase]);
          colorArr.push(allSwatches.colors[prod]);
          console.log(colorArr);
        }
        return colorArr;
      }
      self.allColors = colorArrayFunc();
      //////get all fabrics
      var fabricArrayFunc = function(){
        var fabricArr = [];
        for (var i = 0; i < self.productData.fabrics.length; i++) {
          var fabric = self.productData.fabrics[i].toLowerCase();
          console.log(fabric);
          // console.log(allSwatches.color[prodcolors[i].toLowerCase]);
          fabricArr.push(allSwatches.fabrics[fabric]);
          console.log(fabricArr);
        }
        return fabricArr;
      }
      self.allFabrics = fabricArrayFunc();
      //////get seasons
      var seasonArrayFunc = function(){
        var seasonArr = [];
        for (var i = 0; i < self.productData.seasons.length; i++) {
          var season = self.productData.seasons[i].toLowerCase();
          console.log(season);
          seasonArr.push(allSwatches.seasons[season]);
          console.log(seasonArr);
        }
        return seasonArr;
      }
      self.allSeasons = seasonArrayFunc();
    }

    function popImages(){
      self.allImages = self.productData.images;
    }
    //////////logic to populate page on load//
    //////////////////////////////////////////

  /////end viewProduct controller
  ////////////////////////
  ////////////////////////
  }
