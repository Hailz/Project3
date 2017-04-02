angular.module('AppServices', ['ngResource'])

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
        sendMessage: function(message, number){
            return $http.post('/twilioClient', [message, number])
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
        addExcuse: function(newExcuse){
            return $http.post('/api/excuses', newExcuse)
        },
        updateExcuse: function(excuse){
             console.log("id is: " + excuse._id, "rating is " + excuse.rating)
            return $http.put('api/excuses/'+ excuse._id, excuse)
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
        getComment: function(id){
            return $http.get('/api/comments/'+id);
        },
        createComment: function(comment) {
            return $http.post('/api/comments', comment)
        },
        updateComment: function(id, comment) {
            return $http.put('/api/comments/'+ id, comment)

        }, 
        deleteComment: function(id) {
            return $http.delete('/api/comments/' + id)
            .then(function success(res){
                return res.data
            }, function error(err){
                return null;
            });
        },
    }
}])
.factory("UsersAPI", ["$http", function($http) {
   return {
        getUser: function(id) {
            return $http.get('api/users/' + id)
        },
        updateProfile: function(profile){
            console.log("Profile id: " + profile.id, "Profile name: " + profile.name)
            return $http.put('/api/users/' + profile.id, profile)
            .then(function success(res){
                return res.data
            }, function error(err){
                return console.log(err)
            })
        },
        deleteProfile: function(profile){
            console.log("BUH BYE Profile id: " + profile)
            return $http.delete('/api/users/' + profile)
            .then(function success(res){
                return res.data
            }, function error(err){
                return console.log("Faaaaailed to delete " + err)
            })
        }
   }
}])
.factory('FavoritesAPI', ['$http', '$location', function($http, $location){
    return {
        addFavorite: function(favorite){
            return $http.post('/api/favorites', favorite)
        },
        getFavorites: function(){
            return $http.get('/api/favorites/');
        },
        deleteFavorite: function(id){
            console.log("Data check: "+id)
            return $http.delete('/api/favorites/' + id)
            .then(function success(res){
                return res.data
            }, function error(err){
                return console.log("Failed to delete " + err)
            })
        }

    }
}])

