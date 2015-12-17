angular.module('viewProductController', [])

  .controller('viewProductCtrl', viewProductCtrl)

  viewProductCtrl.$inject = ['$http'];
  function viewProductCtrl($http){
    var self = this;
    console.log('viewProductController is working');
    self.test=('self test');



// Submit comment button wiring
  $(".commentSubmitBtn").on('click', function(){
    console.log('Submit comment button is working');
          addProductComment
    });

//function to collect and post comment
function addProductComment() {
                var targetFormId = $(this).attr('data-formId');
                var targetForm = $(targetFormId, productComment);
                var newCommentName = $('.name', targetForm).val();
                var newCommentMessage = $('.message', targetForm).val();

                var myData = {
                    sender: newCommentName,
                    message: newCommentMessage,
                };
                self.test=(myData);
                $http({
                  method: "POST"
                  ,url: "/api/product/comment"
                  ,data: myData
                })
            }



console.log(window.location.hash);

var productId = window.location.hash.split('/')[3];
console.log(productId);

console.log(window.location.hash);
console.log(window.location.hash.split(''));
console.log(window.location.hash.split('/'));
console.log(window.location.hash.split('/')[3]);



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
