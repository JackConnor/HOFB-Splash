angular.module('dashController', ['allProjectsFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects'];
  function dashCtrl($http, allProjects){
    var self = this;

    ///////////////////////////////////////////////////////////////////
    /////////onload event to add initial list of repeated projects
    function loadProjects(callback){
      allProjects.allprojects().then(function(allP){
        console.log(allP);
        self.allProjects = allP
        console.log(self.allProjects);
        callback();
      });

    }

    /////load all active projects into the dashboard view
    function loadInitialList(){
      for (var i = 0; i < self.allProjects.length; i++) {
        $('.designerDashList').append(
          "<div class='projectCell col-md-4 col-xs-12'>"+
            "<div class='projectCellImageHolder'>"+
              "<img src='/img/test.png'>"+
            "<div>"+
            "<div class='projectCellContent'>"+
              "<p>"+self.allProjects[i].name+"</p>"+
            "<div>"+
          "<div>"
          // "<h2>ksdjflksdjflksd</h2>"
        )
        self.allProjects[i]
      }
    }
    ///////will set self.allProjects as all our projects
    loadProjects(loadInitialList);


    ///////////////////////////
    //////Toggle Logic/////////

    ////see all curated projects
    function toggleCurated(){
      $('.designerDashList').html();
      $('.designerDashList').html(
        "<p>list for curated projects</p>"
      );
    }

    ////see all active projects
    function toggleActive(){
      $('.designerDashList').html();
      // $('.designerDashListContainer').html(
      //   "<p>listing projects</p>"
      // );
      loadInitialList();
    }

    /////////////////////////////////////////////////////////
    //////////click functions for toggling designer dashboard

    ////////toggle to curated view
    $('.designerDashCurated').on('click', function(){
      console.log('to curated');
      toggleCurated();
    })

    ////////toggle to active view
    $('.designerDashActive').on('click', function(){
      console.log('to active');
      toggleActive();
    })
    //////////click functions for toggling designer dashboard
    /////////////////////////////////////////////////////////

    //////End Toggle Logic/////
    ///////////////////////////

  /////end dash controller
  ////////////////////////
  ////////////////////////
  }
