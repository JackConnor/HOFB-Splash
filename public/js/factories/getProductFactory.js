var usersFactory = angular.module('getProductFactory', [])

  .factory('getProduct', allUsers);

  getProduct.$inject = ['$http'];
  function getProduct($http){

    function getProductCall(){
      return $http({
        method: "GET"
        ,url: "/api/getProduct"
      })
      .then(function(data){
        self.data = data;
        return data;
      })
    }

    return getProductCall;
    //
  }

  //
  //<script type="text/javascript" src="/plugins/jquery.js"></script>
  //<script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script>
