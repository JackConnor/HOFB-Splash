angular.module('postProjectFactory', [])

  .factory('postProject', postProject);

  postProject.$inject = ['$http'];
  function postProject($http){

    function postProjectToDb(projectArray){
      return $http({
        method: "POST"
        ,url: "/api/projects"
        ,data: projectArray
      })
      .then(function(newProjectInfo){
        console.log('posted project');
        console.log(newProjectInfo);
        return newProjectInfo;
      })
    }

    return {
      postProject: postProjectToDb
    }


  ////////end factory////
  ///////////////////////
  }
