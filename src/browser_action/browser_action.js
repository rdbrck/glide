var ng = angular.module('concourseApp', ['ngAnimate']);


ng.controller('DocsController', [
    '$scope',
    function($scope){
        $scope.ready = false;
        chrome.storage.sync.get('url', function(result) {
            $scope.base_url = result.url;
            $scope.api_url = $scope.base_url+ '/api/v1/'
            if($scope.base_url){
                $scope.reloadProjects()
            }
        });

        $scope.reloadProjects = function(){
            //preload all pipelines
            $scope.resp = request($scope.api_url + 'pipelines');

            //we also need to preload pipeline jobs to check for status errors
            //this determines whether a circle appears next to the name of the project
            for(var i = 0; i < $scope.resp.length; i++){
                $scope.resp[i].jobs = request($scope.api_url + $scope.resp[i].url + '/jobs');
            }
            $scope.ready=true;
            $scope.$digest()  //i know this is bad shush

        }

        $scope.openJobs = function(index, url){
            if(!$scope.resp[index].jobs){
                $scope.resp[index].jobs = request($scope.api_url + url + '/jobs');
            }
            $scope.resp[index].expand = !$scope.resp[index].expand
        }

        $scope.openBuilds = function(index, jindex, job_url, force=false){
            if(!$scope.resp[index].jobs[jindex].builds || force){
                $scope.resp[index].jobs[jindex].builds = request($scope.api_url + job_url + '/builds').slice(0,10);
            }
            $scope.resp[index].jobs[jindex].expand = !$scope.resp[index].jobs[jindex].expand
        }

        $scope.link = function(url){
            chrome.tabs.create({url: $scope.base_url + url});
        }

        $scope.startNewBuild = function(url, pindex, jindex){
            $scope.resp[pindex].jobs[jindex].expand = true
            postRequest($scope.base_url + url +'/builds')
            $scope.openBuilds(pindex, jindex, url, true)
            $scope.resp[index].jobs[jindex].expand = true;
        }

        //check if any of the pipelines has a failing job
        //will display a plain dot next to the pipeline name
        $scope.isJobProblematic = function(index){
            for(var i = 0; i < $scope.resp[index].jobs.length; i++){
                if($scope.resp[index].jobs[i].finished_build == null){
                    continue
                }
                if($scope.resp[index].jobs[i].finished_build.status != 'succeeded'){
                    return true;
                }
            }
            return false;
        }

        $scope.showAbort=function(status){
            return (status == 'pending' || status == 'started')
        }

        $scope.abort = function(url, pindex, jindex, job_url){
            $scope.resp[pindex].jobs[jindex].expand = true
            postRequest($scope.base_url + url +'/abort')
            $scope.openBuilds(pindex, jindex, job_url, true)
            $scope.resp[pindex].jobs[jindex].expand = true
        }

        $scope.saveUrl = function(url){
            $scope.ready = false
            $scope.resp = {}
            $scope.base_url = url;
            $scope.api_url = $scope.base_url+ '/api/v1/'
            chrome.storage.sync.set({'url': url}, function() {
                $scope.reloadProjects()
            });
        }

}]);

var request = function(url){
    var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.send();
      return JSON.parse(xhr.responseText);
}

var postRequest = function(url){
    console.log(url);
    var xhr = new XMLHttpRequest();
      xhr.open("POST", url, false);
      xhr.send();
}
