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
          ,url: "/api/conversations/"+decodedToken.data.name
        })
        .then(function(allConversations){
          self.allConversations = allConversations.data;
          console.log(self.allConversations);
          setHtmlCallback(self.allConversations);
        })
      })
    }

    function addEmailHtml(list){
      for (var i = 0; i < list.length; i++) {
        $('.messageContainer').append(
          '<div class="messagesCell">'+
            "<div class='messageNameHolder'>from: "+list[i].comments[0].sender+"</div>"+
            "<div id='"+list[i]._id+"' class='messageContentHolder'>text: "+ list[i].comments[0].messageText+
          "</div>"
        )
      }
      addInteractionToMessages(list);
    }

    function addInteractionToMessages(convoList){
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
        console.log(evt.target.id);
        for (var i = 0; i < convoList.length; i++) {
          if(convoList[i]._id == evt.target.id){
            $('.messagesSingleContainer').html('')
            $('.messagesSingleContainer').append(
              // '<div class="messageContent">'+
              //   "<p class='messageSender'>"+comment.data.sender+"</p>"+
              //   "<p class='messageText'>"+comment.data.commentText+"</p>"+
              // "</div>"
            )
          }
        }
        // var messageId = $(evt.target)[0].id;
        // $http({
        //   method: "GET"
        //   ,url: "/api/comment/"+messageId
        //   // +window.location.hash.split('/')[2]
        // })
        // .then(function(comment){
        //   $('.messagesSingleContainer').html('')
        //   $('.messagesSingleContainer').append(
        //     '<div class="messageContent">'+
        //       "<p class='messageSender'>"+comment.data.sender+"</p>"+
        //       "<p class='messageText'>"+comment.data.commentText+"</p>"+
        //     "</div>"
        //   )
        // })
      })
    }
    allMessagesFunc(addEmailHtml);/////call the function to load all messages

    ///////only for single message page, which is no longer in our final design
    // if(window.location.hash.split('/')[1] == 'message'){
    //   var messageId = window.location.hash.split('/')[2];
    //   $http({
    //     method: "GET"
    //     ,url: "/api/comment/"+window.location.hash.split("/")[2]
    //     // +window.location.hash.split('/')[2]
    //   })
    //   .then(function(comment){
    //     self.sender = comment.data.sender;
    //     self.commentText = comment.data.commentText;
    //   })
    // }

    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin";
    })
  /////////end of the messages controller
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
