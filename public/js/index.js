let socket = io();
var address = "new york";

socket.on('connect', () => {

  // requestData((data) => {
  //   //temporary
  //   var temp = document.getElementById("temp-data")
  //   temp.innerHTML += JSON.stringify(data)
  //
  //   console.log(data)
  // })

});

//called on initMap() in index.html, creates a marker for each valid location from the database
function initMarkers(map, geocoder){

  requestData((data) => {

    data.forEach((item) => {

      geocoder.geocode( { 'address': item.location}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();

          item.coords = {
            lat: latitude,
            lng: longitude,
          }

          console.log("Placing marker at: " + item.location + " [" + item.coords.lat + "," + item.coords.lng + "]")
          placeMarker(map, item)
        }
        else {
          console.log("Failed to place marker for item: " + JSON.stringify(item))
        }
      })
    })
  })
}

function placeMarker(map, data){

  var marker = new google.maps.Marker({
    position: data.coords,
    map: map
  });

  marker.addListener('click', function() {

    map.setCenter(marker.getPosition());

    var panel_width = document.getElementById("sidePanel").style.width;

    if(panel_width == "0px") {
      document.getElementById("sidePanel").style.width = "300px";
      requestSidePanel(data);
    }
    else {
      document.getElementById("sidePanel").style.width = "0px";
    }

  });
}

function requestData(onDataSent){

  console.log('Requesting data.')
  socket.emit('requestData')

  //waits for data to be sent
  socket.on('dataSent', (jsonData) => {

    //parses json string to a js object
    var data = JSON.parse(jsonData)
    onDataSent(data)

  });
}
function requestSidePanel(data){

  var temp = document.getElementById("place");
  temp.innerHTML = data.location;

  var ul = document.getElementById("list");
  ul.innerHTML = ""

  var li = document.createElement("li");
  li.appendChild(document.createTextNode(data.comments));
  ul.appendChild(li);
}
