let socket = io();
const MARKER_COLLECTION = 'data'
const MESSAGE_BOARD_COLLECTION = 'message_board'

socket.on('connect', () => {
  updateMessageBoard()
});



//called on initMap() in index.html, creates a marker for each valid location from the database
function initMarkers(map, geocoder){

  requestData(MARKER_COLLECTION, (data) => {

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

function requestSidePanel(data){

  var temp = document.getElementById("place");
  temp.innerHTML = data.location;

  var ul = document.getElementById("list");
  ul.innerHTML = ""

  var li = document.createElement("li");
  li.appendChild(document.createTextNode(data.comments));
  ul.appendChild(li);
}

function updateMessageBoard(){

  console.log("Updating message board.")

  requestData(MESSAGE_BOARD_COLLECTION, (data) => {

    var posts_wrapper = document.getElementById("message-board-posts")
    posts_wrapper.innerHTML = ""

    data.slice().reverse().forEach((item) => {
      var post = document.createElement("div");
      post.className = "post"
      post.innerHTML = item.message
      posts_wrapper.appendChild(post)
    });

  })
}

function postMessage(){
  var message_input = document.getElementById("message-board-input")

  var message = {
    message: message_input.value
  }

  console.log("Posting message: " + message.message.toString())
  saveToDatabase(MESSAGE_BOARD_COLLECTION, message, () => {
    updateMessageBoard()
  });
}

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

function saveToDatabase(collection_name, data, callback) {
  var jsonData = JSON.stringify(data)

  console.log('Requesting to save data to collection: ' + collection_name)

  socket.on('dataSaved', () => {
    console.log("Data successfully saved to database.")
    callback()
  })

  socket.emit('saveData', collection_name, jsonData)


}
