var app = angular.module('editProjectController', ['postProjectFactory', 'getProductFactory'])

  .controller('editProjectCtrl', editProjectCtrl)

  editProjectCtrl.$inject = ['$http', 'postProject', 'getProduct']
  function editProjectCtrl($http, postProject){
    var self = this;
    // getProduct();
    var productId = window.location.hash.split('/')[3];
    $http({
      method: "GET"
      ,url: "/api/product/"+productId
    })
    .then(function(product){
      self.currentProduct = product.data;
      loadData(self.currentProduct);
    })

    function loadData(productObject){
      console.log(productObject);
      //////load text inputs
      $('.newProductTitle').val(productObject.name)
      $('.newProductDescription').val(productObject.description);
      $('.newProductTagsInput').val(productObject.tags.join(', '))
      $('.newProductCollectionsInput').val(productObject.collections.join(', '))
      $('.newProductType').val(productObject.productType);
      $('.newProductVendor').val(productObject.vendor);
      /////add photos
      var addImgsFunc = function(){
        $('.newProductCurrentImage').attr('src', productObject.images[0])
        for (var i = 0; i < productObject.images.length; i++) {
          $('#newProductMiniImage'+i).attr('src' , productObject.images[i]);
        }
      }
      addImgsFunc();
      //////functions for addding swatches
      function addSeasons(){
        var seasonHtmlArray = $('.createSeason');
        console.log(seasonHtmlArray);
        var currentValues = productObject.seasons;
        console.log(currentValues);
        for (var i = 0; i < seasonHtmlArray.length; i++) {
          var elType = seasonHtmlArray[i].classList[1].slice(6, 20);
          console.log(elType);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[i]){
              console.log(seasonHtmlArray[i]);
              $(seasonHtmlArray[i]).css({
                backgroundColor: "blue"
              })
            }
          }

        }
      }
      addSeasons();

    }
  ////////////////////////////
  ////////////////////////////
  //////end edit controller///
  }
