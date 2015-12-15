var getProductFactory = angular.module('getProductFactory', [])

  .factory('getProduct', getProduct);

  getProduct.$inject = ['$http'];
  function getProduct($http){

    return function getProductCall(productId){
      $http({
        method: "GET"
        ,url: "/api/product/"+productId
      })
      .then(function(data){
        self.data = data;
        console.log(self.data);
        return data;
      })
    }
    //
  }

  //
  //<script type="text/javascript" src="/plugins/jquery.js"></script>
  //<script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script>
