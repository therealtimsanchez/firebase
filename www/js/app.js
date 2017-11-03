// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('afapp', ['ionic', 'firebase'])

///// WEATHER SERVICE FACTORY //////////////////////////////////////////////////
.factory('DSWeatherService',['$sce','$http', function($sce, $http){

    //factory allows us to specify an object to send back
    var dsweatherService = {};
    
    //DarkSky API key
    var key = "dddea3dd862d8d4eea367c15200c0e5a";

    //get current rest conditions
    dsweatherService.getCurrentConditions = function(city){

        //for the API
        var url = "https://api.darksky.net/forecast/" +
                key + "/" + city.lat + "," + city.lon + "?callback=JSON_CALLBACK";
                
        console.log(url);

        //the current ionic bundle is supporting Angular 1.5.3
        //thus, the following won't work

        //var trustedurl = $sce.trustAsResourceUrl(url);
        //return $http.jsonp(trustedurl, {jsonpCallbackParam: 'callback'});

        return $http.jsonp(url);

    };
    
    return dsweatherService;

}])

.factory("localStorageService", function($window, $rootScope) {
    
    angular.element($window).on('storage', function(event) {
        if (event.key === 'current-weather') {
            $rootScope.$apply();
        }
    });    
    
    return {
        setData: function(val) {
            $window.localStorage && $window.localStorage.setItem('current-weather', val);
            return this;
        },
        getData: function() {
            
            var val = $window.localStorage && $window.localStorage.getItem('current-weather');
            
            var data = angular.fromJson(val);
            
            return data; 
        }
    };
})

.config(function ($stateProvider, $urlRouterProvider) {


  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/home/home.html'
    })
    .state('weather', {
      url: '/weather',
      controller: 'WeatherController as wc',
      templateUrl: 'views/weather/weather.html'
    });

  $urlRouterProvider.otherwise('/home');

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
