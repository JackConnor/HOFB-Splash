angular.module('allMessagesFactory', [])

  .factory('allMessages', allMessages)

  allMessages.$inject = ['$http'];
  function allMessages($http){

    function allMessagesFunc(){
      return $http({
        method: "GET"
        ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      })
      .then(function(decodedToken){
        console.log(decodedToken);
        $http({
          method: "GET"
          ,url: "/api/view/comments/"+decodedToken.data.name
        })
        .then(function(allComments){
          console.log(allComments);
          return allComments.data;
        })
      })
    }

    return {
      allMessages: allMessagesFunc()
      // function(){
      //   return $http({
      //     method: "GET"
      //     ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      //   })
      //   .then(function(decodedToken){
      //     console.log(decodedToken.data.name);
      //     $http({
      //       method: "GET"
      //       ,url: "/api/view/comments/"+decodedToken.data.name
      //     })
      //     .then(function(allComments){
      //       console.log(allComments);
      //       self.allUserMessages = allComments;
      //       return self.allUserMessages;
      //     })
      //   })
      // }
    }

  }
