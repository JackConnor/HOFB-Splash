angular.module('postProjectFactory', [])

  .factory('postProject', postProject);

  postProject.$inject = ['$http'];
  function postProject($http){

    function postProjectToDb(projectArray, callback){
      return $http({
        method: "POST"
        ,url: "/api/products"
        ,data: projectArray
      })
      .then(function(newProjectInfo){
        console.log('posted project');
        console.log(newProjectInfo);
        callback();
        return newProjectInfo;
      })
    }

    return {
      postProject: postProjectToDb
    }


  ////////end factory////
  ///////////////////////
  }
