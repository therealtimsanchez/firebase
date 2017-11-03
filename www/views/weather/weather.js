angular.module('afapp')
.filter('direction', function() {
  
  var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];  
  
  //filter method for getting wind direction
  return function(degree) {
    if (degree > 338) {
      degree = 360 - degree;
    }
    var index = Math.floor((degree + 22) / 45);
    return directions[index];
  };
})

.controller('WeatherController', ['$scope','$ionicLoading', 
                                  '$firebaseObject', 'DSWeatherService', 
                                  'localStorageService',
    function ($scope, $ionicLoading, $firebaseObject, DSWeatherService, localStorageService) {

      var wc = this;

      var age = Date.now();

      var first = true;
      console.log(first);      

      wc.selected_city = 
      {
          id: "KAMA",
          lat: 35.2193611,
          lon: -101.7059167,
          weather: {
            current_conditions: "",
            temperature: 0,
            humidity: 0,
            pressure: 0,
            wind_speed: 0,
            wind_direction: 0
          }
          
      };

      //enable our ability to contact the database at a certain point
      var ref  = firebase.database().ref();
      //obtain the firebas object so that we can sync changes
      wc.db = $firebaseObject(ref);      
      
      //load from local storage
      wc.latestWeather = function() {
          return localStorageService.getData();
      };
      
      //update to local storage
      wc.updateWeather = function(val) {
          return localStorageService.setData(val);
      };

      //get weather from service/local storage
      wc.getWeather = function(){
          
        //ionic's "I'm busy loading graphic"
        $ionicLoading.show();        
        
        //is weather more than 15 minutes old?      
        if(Date.now() > age + 1000 * 60 * 15 || first){
          
          //it is no longer the first time
          first = false;
          
          //get new age
          //age = Date.now();

          DSWeatherService.getCurrentConditions(wc.selected_city)
            .then(function(res){
                console.log(res.data);

                //for the controller
                wc.selected_city.weather.current_conditions = res.data.minutely.summary;
                wc.selected_city.weather.temperature = res.data.currently.temperature;
                wc.selected_city.weather.pressure = res.data.currently.pressure;
                wc.selected_city.weather.humidity = res.data.currently.humidity;
                wc.selected_city.weather.wind_speed = res.data.currently.windSpeed;
                wc.selected_city.weather.wind_direction = res.data.currently.windBearing;

                //for the database
                wc.db.latest_current_conditions = res.data.minutely.summary;
                wc.db.latest_temperature = res.data.currently.temperature;
                wc.db.latest_pressure = res.data.currently.pressure;
                wc.db.latest_humidity = res.data.currently.humidity;
                wc.db.latest_wind_speed = res.data.currently.windSpeed;
                wc.db.latest_wind_direction = res.data.currently.windBearing;

                //set the local age variable and last accessed at once        
                wc.db.last_accessed = age = new Date().getTime();

                //save it
                wc.db.$save().then(function(){
                    console.log("SAVED");
                }).catch(function(error){
                    console.log("PROBLEM: " + error);
                });

                //hide ionic's "I'm busy loading" graphic
                $ionicLoading.hide();
                
            })
            .catch(function(err){
                console.log(err);
                $ionicLoading.show({
                  template: 'Could not load weather. Please try again later.',
                  duration: 3000
                });
                
                //ionic's "I'm busy loading graphic"
                $ionicLoading.hide();                            
            });          
          
        }else{

          wc.weather = wc.latestWeather();
        }
        
        //ionic's "I'm busy loading graphic"
        $ionicLoading.hide();         
        
      };
      
      //get the weather
      wc.getWeather();      

}]);