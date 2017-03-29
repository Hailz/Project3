angular.module('AppServices', ['ngResource'])
// .factory('Recipe', ['$resource', function($resource) {
//     return $resource('/api/recipes/:id');
// }])
.factory("Auth", ["$window", function($window) {
    return {
        saveToken: function(token) {
        $window.localStorage['secretrecipes-token'] = token;
        },
        removeToken: function() {
        $window.localStorage.removeItem('secretrecipes-token');
        },
        getToken: function() {
        return $window.localStorage['secretrecipes-token'];
        },
        isLoggedIn: function() {
        var token = this.getToken();
        return token ? true : false;
        },
        currentUser: function() {
        if(this.isLoggedIn()){
            var token = this.getToken();

            try {
            // vuln code
            var payload = JSON.parse($window.atob(token.split(".")[1]));
            console.log("payload decoded: " + payload);
            return payload;
            }
            catch (err){ 
            // graceful err handling
            console.log(err)
            return false;
            }
        } else {
            return false;
        }
    }
    }
}])
.factory("AuthInterceptor", ["Auth", function(Auth) {
    return {
        request: function(config) {
        var token = Auth.getToken();
        if(token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
        }
    }
}])
.factory("Message", ["$http", function($http) {
    return {
        sendMessage: function(message){
            console.log(message)
            return $http.post('/twilioClient', [message])
        }
    } 
}])
.factory('ExcusesAPI', ['$http', '$location', function($http, $location){
    return {
        getAllExcuses: function(){
            return $http.get('/api/excuses/');
        },
        getExcuse: function(id){
            return $http.get('/api/excuses/'+id);
        },
        updateExcuse: function(rating){
            return $http.put('/api/excuses/'+ excuse._id, rating)
            .then(function success(res){
                return res.data
            }, function error(err){
                return null;
            });
        }
    }
}])
.factory('CommentsAPI', ['$http', function($http){
return {
        getAllComments: function() {
            return $http.get('/api/comments');
        },
        createComment: function() {
            return $http.post('/api/comments/');
        },
        deleteComment: function() {
            return $http.delete('/api/comments/' + id);
        },
        updateComment: function() {
            return $http.put('/api/comments/' + id);
        }   
    }
}])
.factory("UsersAPI", ["$http", function($http) {
   return {
       getUser: function(id) {
           return $http.get('api/users/' + id)
       }
   }
}])
