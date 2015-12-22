angular.module('viewProductController', ['checkPwFactory'])

  .controller('viewProductCtrl', viewProductCtrl)

  viewProductCtrl.$inject = ['$http', 'checkPw'];
  function viewProductCtrl($http, checkPw){
    var self = this;
    console.log('viewProductController is working');
    self.test=('self test');
    // checkPw.checkPassword();
//Product Id
    var productId = window.location.hash.split('/')[3];
    console.log(productId);


// Submit comment button wiring
  $(".commentSubmitBtn").on('click', function(){
    console.log('Submit comment button is working');
          addProductComment();
    });

//function to collect and post comment
function addProductComment() {
                // var targetFormId = $(this).attr('data-formId');
                // var targetForm = $(targetFormId);
                var newCommentId = $(productId)
                var newCommentSender = $('.sender').val();
                var newCommentMessage = $('.message').val();

                var myData = {
                    sender: newCommentSender,
                    message: newCommentMessage,
                };
                console.log(myData);
                self.test=(myData);
                $http({
                  method: "POST"
                  ,url: "/api/product/comment"
                  ,data: myData
                })
                .then(function(data){
                  console.log(data);
                })

            }



console.log(window.location.hash);

var productId = window.location.hash.split('/')[3];
console.log(productId);

    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin"
    })


// $http({
//  method:'GET'
//  ,url:'/api/product/'+ productId
// })
// .then(function(data){
// console.log(data);
// self.data=(data.data);
// })

$http({
 method:'GET'
 ,url:'/api/view/product'
})
.then(function(data){
console.log(data);
self.allComments=(data.data);
})

  //self.seedComments = [{_id:'10', sender:'chris', date:'10/21/2015', commentText:'hello first comment'}, {_id:'10',sender:'John', date:'10/2/2015', commentText:'hello second comment'},{_id:'10',sender:'matt', date:'10/22/2015', commentText:'hello third comment'},{_id:'10', sender:'Gabe', date:'10/25/2015', commentText:'hello last comment'}]
  //self.test=('self test'); // quick way to testing displaying data
  /////end viewProduct controller
  ////////////////////////
  ////////////////////////
  }
