$(function () {
  var socket = io();
  $('form').submit(function(e) {
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
  socket.on('past messages', function({messages}) {
    console.log('client received passed messages: ', messages);
    
    // var li = messages.length && `<p>User: ${messages[0].user} | Message: ${messages[0].text}</p>`;
    // $('#past_messages').append($('<li>').html(li));

    messages.forEach(function(message) {
      var li = `<p>User: ${message.user} | Message: ${message.text}</p>`;
      $('#messages').append($('<li>').html(li));
    })
  });
  socket.on('chat message', function(msg) {
    console.log('client received chat message: ',msg)
    var li = `<p>User: ${msg.user} | Message: ${msg.text}</p>`;
    $('#messages').append($('<li>').html(li)); 
  });

  socket.on('connected', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });
  socket.on('disconnected', function(msg) {
    $('#messages').append($('<li>').text(msg))
  });
});