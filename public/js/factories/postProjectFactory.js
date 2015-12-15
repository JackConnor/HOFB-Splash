angular.module('postProjectFactory', [])

  .factory('postProject', postProject);

  postProject.$inject = ['$http'];
  function postProject($http){

    function postProjectToDb(projectArray, callback){
      console.log('in factory');
      return $http({
        method: "POST"
        ,url: "/api/products"
        ,data: projectArray
      })
      .then(function(newProjectInfo){
        console.log('posted project');
        console.log(newProjectInfo);
        console.log('that was just the Id to compare against');
        callback(newProjectInfo.data._id);
        // return newProjectInfo;
      })
    }

    return {
      postProject: postProjectToDb
    }


  ////////end factory////
  ///////////////////////
  }
