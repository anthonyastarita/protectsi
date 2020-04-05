let socket = io();

function addLocation() {
    var form = document.getElementById("locationInput");
    var input = document.createElement("input");
    input.type = "text";
    input.size = 40;
    input.maxLength = 150;
    var br = document.createElement("br");
    form.appendChild(input);
    form.appendChild(br);
}

function save(){
  console.log('Submitting data.')

  // var name_input = document.getElementById("input-name");
  var location_input = document.getElementById("searchTextField");
  var comment_input = document.getElementById("input-comments");

  var symptoms_value

  if (document.getElementById("input-radio-you").checked) {
    symptoms_value = document.getElementById("input-radio-you").value
  }
  else if (document.getElementById("input-radio-close-contact").checked) {
    symptoms_value = document.getElementById("input-radio-close-contact").value
  }
  else if (document.getElementById("input-radio-no-symptoms").checked) {
    symptoms_value = document.getElementById("input-radio-no-symptoms").value
  }

  var data = {
    // name: name_input.value,
    location: location_input.value,
    symptoms: symptoms_value,
    comments: comment_input.value
  }

  saveToDatabase('data', data)

  var log = document.getElementById("log");
  log.innerHTML = "Saved to database: " + JSON.stringify(data)
}

function saveToDatabase(collection_name, data) {
  var jsonData = JSON.stringify(data)

  console.log('Requesting to save data: ' + jsonData)

  socket.emit('saveData', collection_name, jsonData)
}
