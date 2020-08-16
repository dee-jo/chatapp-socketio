$.fn.changeRoom = function(value) {
  console.log('changeRoom() executed, option value: ', value);
  // TODO: this fn should connect to the socket.io namespace=value on the server
}

$(() => {
  const socket = io();

  const dropdown = $('#rooms-dropdown');
  let selected = '';
  const url = '/rooms'
  dropdown.empty();
  $.get(url, (rooms) => {
    selected = rooms[0];
    $.each(rooms, (index, room) => {
      if (index === 0) {
        dropdown.append($('<option></option>').attr('value', room).attr('selected', true).text(room));  
      } else {
        dropdown.append($('<option></option>').attr('value', room).text(room));
      }
      // console.log(room);
    })
  })

  dropdown.on('change', function() {
    $.fn.changeRoom(this.value);
  })


  $('form').submit((e) => {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', {
      uId: socket.uId,
      user: $('#user').val(),
      text: $('#m').val()
    });
    $('#m').val('');
    $('#user').val('');
    return false;
  });

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

  
  
});



