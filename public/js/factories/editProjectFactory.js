angular.module('editProjectFactory', [])

  .factory('editProject', editProject);

  editProject.$inject = ['$http'];
  function editProject($http){

    function editProjectToDb(projectArray, callback){
      console.log('in factory');
      console.log(projectArray);
      return $http({
        method: "POST"
        ,url: "/api/products/update"
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
      editProject: editProjectToDb
    }


  ////////end factory////
  ///////////////////////
  }
