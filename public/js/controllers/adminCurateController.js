angular.module('adminCurateController', ['getSwatchesFactory'])

  .controller('adminCurateCtrl', adminCurateCtrl)

  adminCurateCtrl.$inject = ['$http','allSwatches'];


  function adminCurateCtrl($http, allSwatches){
    var self = this;

    // onClick directive function to populate a product based on product Id
    function getId($event){
      console.log($event.currentTarget);
      console.log($event.currentTarget.id);
      productId = $event.currentTarget.id;
      //get data to console.log, populate data
      $http({
        method: "GET"
        ,url: "/api/product/"+productId
      })
      .then(function(product){
        self.curatedData = product.data;
        console.log(self.curatedData);
        popSwatches();
      })
      $($event.currentTarget).css({
        backgroundColor: "#B2B2B3"
      })
    }
    // need to use self. syntax to make the function usable for ngClick directive
    self.getId = getId;

    function unique(list) {
      var result = [];
      $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
      });
      return result;
    }

    var productId = ('56a15c60dd2dea2436fbb8ed');
    // var productId = window.location.hash.split('/')[3];
    $http({
      method: "GET"
      ,url: "/api/admin/curate/product/"+productId
    })
    .then(function(product){
      self.curatedData = product.data;
      console.log(self.curatedData);
      popSwatches();
    })

    function popSwatches(){
      console.log('TESTING POPSWATCHES');
      // get all colors
      var colorArrayFunc = function(){
        var prodfabrics = self.curatedData.fabrics;
        console.log(prodfabrics);
        var colorArr = [];
        for (var i = 0; i < prodfabrics.length; i++) {
          for (var j = 0; j < prodfabrics[i].colors.length; j++) {
            colorArr.push(prodfabrics[i].colors[j]);
          }
        }
        console.log(colorArr);
        var colorArr = unique(colorArr)
        console.log(colorArr);
        var colorList = [];
        for (var i = 0; i < colorArr.length; i++) {
          console.log(allSwatches.colors[colorArr[i]]);
          colorList.push(allSwatches.colors[colorArr[i]])
        }
        return colorList;
      }
      self.allColors = colorArrayFunc();
      console.log(self.allColors);


      //////get all fabrics
      var fabricArrayFunc = function(){
        console.log('TEST FABRICArray');
        var fabricArr = [];
        if(self.curatedData.fabrics.length){ // if statement for IF there any fabrics as part of this?
          for (var i = 0; i < self.curatedData.fabrics.length; i++) {
            var fabric = self.curatedData.fabrics[i].name.toLowerCase();
            fabricArr.push(allSwatches.fabrics[fabric].url);
            console.log(allSwatches.fabrics[fabric]);
          }
          console.log(fabricArr);
          return fabricArr;
        }
      }
      console.log(self.curatedData);
      self.allFabrics = fabricArrayFunc();
    }


    $http({
      method: "GET"
      ,url: '/api/submitted/products'
    })
    .then(function(products){
      var allProjects = products.data;
      var allProjectsAlreadyCurated = [];
      var curatedProjectsArray = [];
      console.log(allProjects);
      for (var i = 0; i < allProjects.length; i++) {
        if(allProjects[i].status == "curated" || allProjects[i].status == "bought"){
          allProjectsAlreadyCurated.push(allProjects[i]);
        }
        else if(allProjects[i].status == "submitted to curator"){
          curatedProjectsArray.push(allProjects[i]);
        }
        self.alreadyCurated = curatedProjectsArray;
        self.curatedProjects = allProjectsAlreadyCurated;
      }
      console.log(self.alreadyCurated);
      //////add time-since-creation field
      var collectionName = ["All"];
      for (var i = 0; i < self.alreadyCurated.length; i++) {
        function timeSince(){
          var nowDate = new Date();
          var timeProj = self.alreadyCurated[i].timestamp;
          var projYear = timeProj.split('-')[0];
          var projMonth = timeProj.split('-')[1];
          var projDay = timeProj.split('-')[2];
          var yearsSince = nowDate.getFullYear() - projYear;
          var monthsSince = nowDate.getMonth() - projMonth;
          var daysSince = nowDate.getDate() - projDay;
          if(yearsSince > 0){
            return yearsSince+" years";
          }
          else if(monthsSince > 0){
            return monthsSince+" months";
          }
          else if(daysSince > 0 ){
            return daysSince+" days"
          } else {
            return "Less Than 1 day";
          }
        }
        self.alreadyCurated[i].TimeSinceCreation = timeSince();
      }
      // callback(arg)
    })





    // logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/designer/loginportal"
    })
  ////////end adminCurate controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
