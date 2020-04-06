let socket = io();
const MARKER_COLLECTION = 'data'
const MESSAGE_BOARD_COLLECTION = 'message_board'

socket.on('connect', () => {
  updateMessageBoard()
});

//called on initMap() in index.html, creates a marker for each valid location from the database
function initMarkers(map, geocoder){

  requestData(MARKER_COLLECTION, (data) => {

    console.log("Recieved data.");

    var locations = {};

    data.forEach((item, i) => {

      if (!locations.hasOwnProperty(item.location))
      {
        locations[item.location] = []
      }

      locations[item.location].push(item);
    });

    for (var location in locations)
    {
      geocodeLocation(map, geocoder, location, locations[location]);
    }

    // locations.forEach((item, i) => {
    //   geocoder.geocode( { 'address': item.location}, function(results, status) {
    //
    //     if (status == google.maps.GeocoderStatus.OK) {
    //       var latitude = results[0].geometry.location.lat();
    //       var longitude = results[0].geometry.location.lng();
    //
    //       item.coords = {
    //         lat: latitude,
    //         lng: longitude,
    //       }
    //
    //       console.log("Placing marker at: " + item.location + " [" + item.coords.lat + "," + item.coords.lng + "]")
    //       placeMarker(map, item.coords, )
    //     }
    //     else {
    //       console.log("Failed to place marker for item: " + JSON.stringify(item))
    //     }
    //   })
    // });





    // data.forEach((item) => {
    //
    //   if(item.symptoms == null) return;
    //
    //   geocoder.geocode( { 'address': item.location}, function(results, status) {
    //
    //     if (status == google.maps.GeocoderStatus.OK) {
    //       var latitude = results[0].geometry.location.lat();
    //       var longitude = results[0].geometry.location.lng();
    //
    //       item.coords = {
    //         lat: latitude,
    //         lng: longitude,
    //       }
    //
    //       console.log("Placing marker at: " + item.location + " [" + item.coords.lat + "," + item.coords.lng + "]")
    //       placeMarker(map, item.coords, )
    //     }
    //     else {
    //       console.log("Failed to place marker for item: " + JSON.stringify(item))
    //     }
    //   })
    // })
  })
}

function geocodeLocation(map, geocoder, location, data)
{
  geocoder.geocode( { 'address': location}, function(results, status) {

    var temp = location;

    if (status == google.maps.GeocoderStatus.OK) {
      var latitude = results[0].geometry.location.lat();
      var longitude = results[0].geometry.location.lng();

      var coords = {
        lat: latitude,
        lng: longitude,
      }

      placeMarker(map, location, coords, data)
    }
    else {
      console.log("Failed to place marker at location: " + location)
    }
  })
}

function placeMarker(map, location, coords, comments)
{

  console.log("Placing marker at: " + location + " [" + coords.lat + "," + coords.lng + "]")


  // var icon = 'images/google-markers/';
  // switch(data.symptoms){
  //   case 'You':
  //     icon += 'red-dot.png'
  //     break;
  //   case 'Close Contact':
  //     icon += 'yellow-dot.png'
  //     break;
  //   case 'No Symptoms':
  //     icon += 'green-dot.png'
  //     break;
  // }


  var marker = new google.maps.Marker({
    position: coords,
    map: map,
    // icon: icon

  });

  marker.addListener('click', function() {

    map.setCenter(marker.getPosition());

    var panel_width = document.getElementById("sidePanel").style.width;

    if(panel_width == "0px") {
      document.getElementById("sidePanel").style.width = "300px";
      requestSidePanel(location, comments);
    }
    else {
      document.getElementById("sidePanel").style.width = "0px";
    }

  });
}

function requestSidePanel(location, data){

  var temp = document.getElementById("place");
  temp.innerHTML = location;

  var ul = document.getElementById("list");
  ul.innerHTML = ""

  data.forEach((data, i) => {
    
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(data.comments));
    ul.appendChild(li);

  });


}

function updateMessageBoard(){

  console.log("Updating message board.")

  requestData(MESSAGE_BOARD_COLLECTION, (data) => {

    var posts_wrapper = document.getElementById("message-board-posts")
    posts_wrapper.innerHTML = ""

    data.slice().reverse().forEach((item) => {

      if(item.date == null) return

      var post_wrapper = document.createElement("div")
      post_wrapper.className = "post-wrapper"
      posts_wrapper.appendChild(post_wrapper)

      var post = document.createElement("div")
      post.className = "post-message"
      post.innerHTML = "<strong>Anonymous</strong><br>" + item.message
      post_wrapper.appendChild(post)

      var time_stamp = document.createElement("div")
      time_stamp.className = "post-time-stamp"
      time_stamp.innerHTML = item.time + ' ' + item.date
      post_wrapper.appendChild(time_stamp)

    });

  })
}

function postMessage(){
  var message_input = document.getElementById("message-board-input")

  var today = new Date();
  var date = (today.getMonth()+1)+'/'+(today.getDate())+'/'+today.getFullYear();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  time = time.split(':'); // convert to array
  // fetch
  var hours = Number(time[0]);
  var minutes = Number(time[1]);
  var seconds = Number(time[2]);

  // calculate
  var timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue= "" + hours;
  } else if (hours > 12) {
    timeValue= "" + (hours - 12);
  } else if (hours == 0) {
    timeValue= "12";
  }

  timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
  timeValue += (hours >= 12) ? " PM" : " AM";  // get AM/PM

  var message = {
    message: message_input.value,
    date: date,
    time: timeValue
  }

  var jsonMessage = JSON.stringify(message)

  console.log("Posting message: " + jsonMessage)
  socket.emit('postMessage', jsonMessage)

}

socket.on('postAdded', () => {
  updateMessageBoard()
})

function requestData(collection, onDataSent){

  console.log('Requesting data.')
  socket.emit('requestData', collection)

  //waits for data to be sent
  socket.on('dataSent', (collection_name, jsonData) => {

    if(collection_name != collection) return

    //parses json string to a js object
    var data = JSON.parse(jsonData)
    onDataSent(data)

  });
}
