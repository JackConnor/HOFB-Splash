angular.module('messageController', ['allMessagesFactory'])

  .controller('messageCtrl', messageCtrl);

  messageCtrl.$inject = ['$http', 'allMessages'];
  function messageCtrl($http, allMessages){
    var self = this;
    console.log('in the messages Controller');

    function allMessagesFunc(setHtmlCallback){
      $http({
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
          self.allComments = allComments.data;
          setHtmlCallback(self.allComments);
        })
      })
    }

    function addEmailHtml(list){
      for (var i = 0; i < list.length; i++) {
        $('.messageContainer').append(
          '<div class="messagesCell">'+
            "<div class='messageNameHolder'>from: "+list[i].sender+"</div>"+
            "<div class='messageContentHolder'>text: "+ list[i].commentText+
          "</div>"
        )
      }
    }

    function addInteractionToMessages(){

    }

    allMessagesFunc(addEmailHtml);


    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin"
    })
  /////////end of the messages controller
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
