var getProductFactory = angular.module('getProductFactory', [])

  .factory('getProduct', getProduct);

  getProduct.$inject = ['$http'];
  function getProduct($http){

    function getProductCall(productId){
      return $http({
        method: "GET"
        ,url: "/api/product/"+productId
      })
      // .then(function(data){
      //   self.data = data;
      //   console.log(self.data);
      //   return data;
      // })
    }

    return getProductCall;
  }
