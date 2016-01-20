angular.module('messageController', ['allMessagesFactory', 'checkPwFactory', 'singleuserfactory'])

  .controller('messageCtrl', messageCtrl);

  messageCtrl.$inject = ['$http', 'allMessages', 'checkPw', "singleUser"];
  function messageCtrl($http, allMessages, checkPw, singleUser){
    var self = this;
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    if(window.location.host == "beta" || window.location.host == "hofb"){
      window.location.hash = "#/designer/loginportal"
    }
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
          setHtmlCallback(self.allConversations);
          singleUser(self.decodedToken.data.name)
            .then(function(userData){
              self.currentUser = userData.data;
            })
        })
      })
    }

    function addEmailHtml(list){
      for (var i = 0; i < list.length; i++) {
        $('.messageContainer').append(
          '<div class="messagesCell">'+
            "<div class='messageListSquareContainer'>"+
              "<img class='messageListSquareContainerSquare' src='"+list[i].photoUrl+"' id='"+list[i].productId+"'>"+
              "</img>"+
            "</div>"+
            "<div id='"+list[i].productId+"' class='messageContentHolder'>"+
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
      $('.messageContentHolder').on('mouseleave', function(evt){
        for (var i = 0; i < $('.messagesCell').length; i++) {
          $($('.messagesCell')[i]).css({
            'backgroundColor': "#B2B2B4"
            ,color: "black"
          })
        }
        for (var i = 0; i < $('.messageListContentTitle').length; i++) {
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
        var productId = $(evt.target)[0].id;
        self.currentProduct = productId;
        console.log(productId);
        $('.messageChatWindowList').html('');
        for (var i = 0; i < convoList.length; i++) {
          if(convoList[i].productId == evt.target.id){
            console.log(convoList[i].comments.length);
            for (var j = 0; j < convoList[i].comments.length; j++) {
              if(convoList[i].comments[j].sender == self.currentUser.email){
                console.log('yup');
                $('.messageChatWindowList').append(
                  '<div class="messageContentOdd">'+
                    "<p class='messageSender'>"+convoList[i].comments[j].sender+"</p>"+
                    "<p class='messageTextOdd'>"+convoList[i].comments[j].commentText+"</p>"+
                  "</div>"
                )
              }
              else {
                $('.messageChatWindowList').append(
                  '<div class="messageContent">'+
                    "<p class='messageSender'>"+convoList[i].comments[j].sender+"</p>"+
                    "<p class='messageText'>"+convoList[i].comments[j].commentText+"</p>"+
                  "</div>"
                )
              }
            }
          }
        }
        console.log($('.messageChatWindowList').scrollTop());
        console.log($('.messageChatWindowList')[0].scrollHeight);
        $('.messageChatWindowList').scrollTop($('.messageChatWindowList')[0].scrollHeight);/////this sets the the scroll to the bottom
      })
    }
    allMessagesFunc(addEmailHtml);/////call the function to load all messages

    // logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/designer/loginportal"
    })

    //////////////////////////////////////
    ////////////logic for sending messages
    $('.messageSend').on('click', function(){
      console.log('yoyoyoyoy');
      var content = $('.messageWriteContent').val();
      console.log(content);
      var sender = self.currentUser.email;
      console.log(sender);
      $http({
        method: "POST"
        ,url: "/api/conversation"
        ,data: {commentText: content, productId: self.currentProduct, sender: sender}
      })
      .then(function(updatedConvo){
        console.log(updatedConvo);
        /////live add to site
        $('.messageChatWindowList').append(
          '<div class="messageContentOdd">'+
            "<p class='messageSender'>"+sender+"</p>"+
            "<p class='messageTextOdd'>"+content+"</p>"+
          "</div>"
        )
        // $('.messageChatWindowList').scrollTop($('.messageChatWindowList')[0].scrollHeight);
        $('.messageChatWindowList').animate({
          scrollTop: $('.messageChatWindowList')[0].scrollHeight
        }, 1000);
        $('.messageWriteContent').val('');
        // window.location.reload();
      })
    })

    /////////end send message logic//////
    /////////////////////////////////////
    //////navbar click events
    $('.navTitle').on('click', function(){
      window.location.hash = "#/designer/dashboard";
    });
    $('#navBarEnvelopeIcon').on('click', function(){
      window.location.hash = "#/messages";
    })


    /////start of navbar dropdown logic/////////////
    ////////////////////////////////////////////////
    $(".dropbtn").on('click', function(){
      console.log('dropbtn is working');
            myFunction();
            // location.reload();
      });

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
    /////end of navbar dropdown logic/////////////
    ////////////////////////////////////////////////

  /////////end of the messages controller
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
