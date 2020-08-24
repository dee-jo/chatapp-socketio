$.fn.initDropdown = function(rooms) {
  dropdown.empty();
  const selected = rooms[0];
  $.each(rooms, (index, room) => {
    if (room === selected) {
      dropdown.append($('<option></option>').attr('value', room).attr('selected', true).text(room));  
    } else {
      dropdown.append($('<option></option>').attr('value', room).text(room));
    }
    // console.log(room);
  });
  return selected;
}

$.fn.getRoomsFromServer = (roomsUrl) => {
  const rooms = $.get(roomsUrl, (rooms) => {
    return rooms;
  });
  return rooms;
}

// ---------------------- DROPDOWN ROOM MENU ----------------------------------
const roomsUrl = '/rooms';
const dropdown = $('#rooms-dropdown');
const rooms = ['sport', 'music', 'work'];
// const rooms = $.fn.getRoomsFromServer(roomsUrl); TODO
console.log(rooms);
let selected = $.fn.initDropdown(rooms);
let socket = io(`/${selected}`);

dropdown.on('change', function() {
  socket = $.fn.onChangeRoom(this.value);
});

$.fn.onChangeRoom = function(value) {
  console.log('onChangeRoom() executed, option value: ', value);
  return io(`/${value}`);
}



 


// ---------------------- SOCKET -------------------------

socket.on('connected', (msg) => {
  $('#messages').append($('<li>').text(msg));
});

socket.on('disconnected', (msg) => {
  $('#messages').append($('<li>').text(msg))
});

socket.on('past messages', ({messages}) => {
  console.log('client received passed messages: ', messages);
  messages.forEach((message) => {
    var li = `<p>User: ${message.user} | Message: ${message.text}</p>`;
    $('#messages').append($('<li>').html(li));
  })
});

socket.on('chat message', (msg) => {
  console.log('client received chat message: ',msg)
  var li = `<p>User: ${msg.user} | Message: ${msg.text}</p>`;
  $('#messages').append($('<li>').html(li)); 
});



// -------------------------- CHATFORM ------------------------
const chatForm = $('form');
chatForm.submit((e) => {
  e.preventDefault(); // prevents page reloading
  console.log(socket);
  socket.emit('chat message', {
    uId: socket.id,
    namespace: socket.nsp,
    user: $('#user').val(),
    text: $('#m').val()
  });
  $('#m').val('');
  $('#user').val('');
  return false;
});


// ------------ MAIN ------------------

$.fn.getRoomsFromServer();





