angular.module('AppCtrl', ['AppServices'])
.controller('SignupCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {
        email: '',
        password: ''
    };
    $scope.userSignup = function() {
        $http.post('/api/users', $scope.user).then(function success(res) {
        $state.go("home");
        }, function error(err) {
        console.log("Error", err)
        })
    };
}])
.controller('LoginCtrl', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth) {
    $scope.user = {
        email: '',
        password: ''
    };
    $scope.userLogin = function() {
        $http.post("/api/auth", $scope.user).then(function success(res) {
        Auth.saveToken(res.data.token);
        $state.go("home")
        }, function error(err) {
            console.log("Uh oh. Login Failed.")
        })
        }
}])
// .controller('AlertsCtrl', ['$scope', 'Alerts', function($scope, Alerts){
//     $scope.alerts = Alerts.getAll();
// }])
.controller('NavCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location) {
  $scope.isLoggedIn = function() {
    return Auth.isLoggedIn();
  }
  $scope.logout = function() {
    console.log("Before Logout", Auth.getToken());
    Auth.removeToken();
    console.log("After Logout", Auth.getToken());
    $location.path("/login");
  };
}])
.controller('HomeCtrl', ['$scope', '$location', '$http', 'Message', 'ExcusesAPI', 'UsersAPI', function($scope, $location, $http, Message, ExcusesAPI, UsersAPI) {
    $scope.allExcuses = [];
    $scope.excuses = [];
    $scope.searchTerm;

    ExcusesAPI.getAllExcuses()
    .then(function success(res) {
        console.log('in excuses API then promise', res)
        
        $scope.allExcuses = res.data;

        var first = Math.floor((Math.random()*$scope.allExcuses.length-1)+1);
        var second = Math.floor((Math.random()*$scope.allExcuses.length-1)+1);
        var third = Math.floor((Math.random()*$scope.allExcuses.length-1)+1);


        $scope.excuses = [$scope.allExcuses[first], $scope.allExcuses[second], $scope.allExcuses[third]];
        console.log(res.data);
    }, function error(err) {
        console.log("Error", err);
    })

    $scope.sendMsg = function() {
        Message.sendMessage().then(function success(res) {
            console.log("it's working, people " + res)
        },
        function error(err){
            console.log("it's not working, people " + err)
        })
    }

    $scope.searchExcuses = function() {
        console.log("here")
        ExcusesAPI.getAllExcuses($scope.searchTerm).then(function (res) {
            console.log(res)
            $scope.excuses = res.config.data;
        }, function error(err) {
            console.log("Nooo", err)
        })
    }
}])

.controller('OneExcuseCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'CommentsAPI', '$stateParams', function($scope, $location, $http, Auth, ExcusesAPI, CommentsAPI, $stateParams){
    $scope.excuse = {};
    $scope.user = Auth.currentUser()

    ExcusesAPI.getExcuse($stateParams.id)
    .then(function success(res){
    // $scope.excuse = res.data
        console.log(res.data)
    }, function error(err){
        console.log(err)
    })
}])

