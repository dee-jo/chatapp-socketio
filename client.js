$(() => {
  const socket = io();

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