var app = angular.module('editProjectController', ['postProjectFactory', 'getProductFactory'])

  .controller('editProjectCtrl', editProjectCtrl)

  editProjectCtrl.$inject = ['$http', 'postProject', 'getProduct']
  function editProjectCtrl($http, postProject){
    var self = this;
    console.log('yoo');
    // getProduct();
    var productId = window.location.hash.split('/')[3];
    console.log(productId);
    $http({
      method: "GET"
      ,url: "/api/product/"+productId
    })
    .then(function(product){
      console.log(product);
      self.currentProduct = product.data;
      loadData(self.currentProduct);
    })

    function loadData(productObject){
      console.log(productObject);
      //////load text inputs
      $('.newProductTitle').val(productObject.name)
      $('.newProductDescription').val(productObject.description)
    }
  ////////////////////////////
  ////////////////////////////
  //////end edit controller///
  }
