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
            "<div class='messageListSquareContainer'>"+
              "<img class='messageListSquareContainerSquare' src='"+list[i].imageUrl+"' id='"+list[i].productId+"'>"+
              "</img>"+
            "</div>"+
            "<div id='"+list[i]._id+"' class='messageContentHolder'>"+
              "<div class='messageListContentTitle'>"+
                list[i].productName +
              "</div>"+
            "</div>"+
          "</div>"
        )
      }
      addInteractionToMessages(list);
    }

    function addInteractionToMessages(convoList){
      $('.messageListContentTitle').on('mouseenter', function(evt){
        // var elemen = $(evt.target)[0].parentNode
        // console.log(elemen);
        // elemen.css({
        //   backgroundColor: "#B2B2B4"
        //   ,color: 'black'
        // })
      })
      $('.messageListContentTitle').on('mouseleave', function(evt){
        // var elemen = $($($(evt.target)[0].parentNode)[0].parentNode);
        // console.log($(elemen));
        // console.log(elemen.attr('id'));
      })
      $('.messageContentHolder').on('mouseleave', function(evt){
        for (var i = 0; i < $('.messagesCell').length; i++) {
          $($('.messagesCell')[i]).css({
            'backgroundColor': "#B2B2B4"
            ,color: "black"
          })
        }
        for (var i = 0; i < $('.messageListContentTitle').length; i++) {
          console.log($($('.messagesListContentTitle')[i]).css('background-color'));
          $($('.messageListContentTitle')[i]).css({
            'backgroundColor': "#B2B2B4"
            ,color: "black"
          })
        }
        for (var i = 0; i < $('.messageContentHolder').length; i++) {
          $($('.messageContentHolder')[i]).css({
            'backgroundColor': "#B2B2B4"
            ,color: "black"
          })
        }
      })
      $('.messageContentHolder').on('mouseenter', function(evt){
        console.log($(evt.target));
        var elemen = $($(evt.target)[0].parentNode);
        elemen.css({
          backgroundColor: "black"
          ,color: 'white'
        })
        $(evt.target).css({
          backgroundColor: "black"
          ,color: 'white'
        })
        $($(evt.target)[0].children[0]).css({
          backgroundColor: "black"
          ,color: 'white'
        })
        elemen.attr('id', 'lit');
      })
      $('.messageListSquareContainerSquare').on('click', function(evt){
        console.log(evt.target);
        var productId = evt.target.id;
        window.location.hash = "#/view/product/"+productId;
      })
      $('.messageContentHolder').on('click', function(evt){
        console.log(evt.target.id);
        for (var i = 0; i < convoList.length; i++) {
          if(convoList[i]._id == evt.target.id){
            for (var j = 0; j < convoList[i].comments.length; j++) {
              console.log(convoList[i].comments[j].messageText);
              $('.messagesSingleContainer').html('')
              $('.messagesSingleContainer').append(
                '<div class="messageContent">'+
                  "<p class='messageSender'>"+convoList[i].comments[j].sender+"</p>"+
                  "<p class='messageText'>"+convoList[i].comments[j].messageText+"</p>"+
                "</div>"
              );
            }
          }
        }
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
