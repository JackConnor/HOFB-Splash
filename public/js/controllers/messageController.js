angular.module('messageController', ['allMessagesFactory', 'checkPwFactory'])

  .controller('messageCtrl', messageCtrl);

  messageCtrl.$inject = ['$http', 'allMessages', 'checkPw'];
  function messageCtrl($http, allMessages, checkPw){
    var self = this;
    // checkPw.checkPassword();
    function allMessagesFunc(setHtmlCallback){
      $http({
        method: "GET"
        ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      })
      .then(function(decodedToken){
        self.decodedToken = decodedToken;
        $http({
          method: "GET"
          ,url: "/api/view/comments/"+decodedToken.data.name
        })
        .then(function(allComments){
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
            "<div id='"+list[i]._id+"' class='messageContentHolder'>text: "+ list[i].commentText+
          "</div>"
        )
      }
      addInteractionToMessages();
    }

    function addInteractionToMessages(){
      $('.messageContentHolder').on('mouseenter', function(evt){
        $($(evt.target)[0].parentElement).css({
          backgroundColor: "#669999"
        })
      })
      $('.messageContentHolder').on('mouseleave', function(evt){
        $($(evt.target)[0].parentElement).css({
          backgroundColor: "#e0ebeb"
        })
      })
      $('.messageContentHolder').on('click', function(evt){
        var messageId = $(evt.target)[0].id;
        $http({
          method: "GET"
          ,url: "/api/comment/"+messageId
          // +window.location.hash.split('/')[2]
        })
        .then(function(comment){
          $('.messagesSingleContainer').html('')
          $('.messagesSingleContainer').append(
            '<div class="messageContent">'+
              "<p class='messageSender'>"+comment.data.sender+"</p>"+
              "<p class='messageText'>"+comment.data.commentText+"</p>"+
            "</div>"
          )
        })
      })
    }
    allMessagesFunc(addEmailHtml);/////call the function to load all messages

    if(window.location.hash.split('/')[1] == 'message'){
      var messageId = window.location.hash.split('/')[2];
      $http({
        method: "GET"
        ,url: "/api/comment/"+window.location.hash.split("/")[2]
        // +window.location.hash.split('/')[2]
      })
      .then(function(comment){
        self.sender = comment.data.sender;
        self.commentText = comment.data.commentText;
      })
    }

    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin";
    })
  /////////end of the messages controller
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
