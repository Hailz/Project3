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
    $scope.excuses = [];
    $scope.searchTerm;

    ExcusesAPI.getAllExcuses()
    .then(function success(res) {
        console.log('in excuses API then promise', res)
        $scope.excuses = res.data;
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// .controller('CommentCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'UsersAPI', function($scope, $location, $http, Auth, ExcusesAPI, UsersAPI){

//     $scope.temp = Auth.currentUser();
//     var curUser = $scope.temp.id;

//     UsersAPI.getUser(curUser).then(function(user){
//         var currentUserId = user.data.id,
//         var currentUser = user.data.name;
//         console.log("User val", user.data.name)

//         $scope.newComment = {
//             excuseId: '',
//             comment: '',
//             userId: currentUserId,
//             commentAuthor: currentUser
//         }  
//     })
//     $scope.addComment = function() {
//         console.log($scope.newComment)
//         CommentsAPI.createComment($scope.newComment)
//         .then(function success(res) {
//             $location.path('back') //probably won't work. May be able to implement similar concept...more on this later
//         }, function error(err) {
//             console.log("Error with create", err)
//         })
//     };
// }]) 
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
// .controller('ExcusesCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'UsersAPI', function($scope, $location, $http, Auth, ExcusesAPI, UsersAPI){
//     $scope.excuses = [];
//     $scope.searchTerm;

//     ExcusesAPI.getAllExcuses()
//     .then(function success(res) {
//         console.log(res)
//         $scope.excuses = res.data;
//     }, function error(err) {
//         console.log("Error", err);
//     })

//     $scope.searchExcuses = function() {
//         console.log("here")
//         ExcusesAPI.getAllExcuses($scope.searchTerm).then(function (res) {
//             console.log(res)
//             $scope.excuses = res.config.data;
//         }, function error(err) {
//             console.log("Nooo", err)
//         })
//     }
// }])
/////////////////////////////////////////////////////////////////////////////////////////////
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
.controller('CommentCtrl', ['$scope', '$location', '$http', 'Auth', 'CommentsAPI', 'UsersAPI', function($scope, $location, $http, Auth, CommentsAPI, UsersAPI){
    $scope.comments = [];
    CommentsAPI.getAllComments()
    .then(function success(res) {
        console.log(res);
        CommentsAPI.createComment()
        .then(function success(res) {
            console.log(res)
        }, function error(err) {
            console.log("Error", err);
            })
        CommentsAPI.deleteComment()
        .then(function success(res) {
            console.log(res)
        }, function error(err) {
            console.log("Error", err);
            })
        CommentsAPI.updateComment()
        .then(function success(res) {
            console.log(res)
        }, function error(err) {
            console.log("Error", err);
            })
    }, function error(err) {
        console.log("Error", err);
        }
    )
}])




// .controller('CommentController', function(){
//     this.comment = {};
//     this.addComment = function(post){
//       this.comment.createdOn = Date.now();
//       post.comments.push(this.comment);
//       this.comment ={};
//     };
//   });

