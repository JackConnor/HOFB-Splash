angular.module('dashController', ['allProjectsFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects'];
  function dashCtrl($http, allProjects){
    var self = this;

    /////////onload event to add initial list of repeated projects
    function loadProjects(){
      var projects = allProjects.allprojects();
      console.log(projects);
      self.allProjects = projects;
    }
    loadProjects();

    ///////////////////////////
    //////Toggle Logic/////////

    ////get all curated projects
    function toggleCurated(){
      $('.designerDashListContainer').html();
      $('.designerDashListContainer').html(
        "<p>list for curated projects</p>"
      );
    }

    function toggleActive(){
      $('.designerDashListContainer').html();
      $('.designerDashListContainer').html(
        "<p>listing projects</p>"
      );
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
