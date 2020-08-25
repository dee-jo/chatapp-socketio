import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';


const useSocket = () => {
  const socketRef = useRef();
  const [ connectedSocket, setConnectedSocket] = useState({});
  let currentRoom = '';
  const [ messages, setMessages ] = useState([{room: '', message: ''}]);
  const [ rooms, setRooms ] = useState([]);
  const [ messagesByRooms, setMessagesByRooms ] = useState([]);

 
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
  
    socketRef.current.on("joined rooms", (rooms, messagesByRooms) => {
      setRooms(removeFirstIndex(rooms));
      setConnectedSocket(rooms[0]);
      // TODO:  get messages from server for the rooms joined

      // set room events
      setRoomEvents(rooms);
      
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (room) => {
    currentRoom = room;
    return ({ message }) => {
      socketRef.current.emit(`message for ${room}`, { message });
    };
  }

  const removeFirstIndex = (array) => {
    return array.filter((item, index) => {
      return index != 0;
    })
  }

  const setRoomEvents = (rooms) => {
    rooms.forEach((room) => {
      socketRef.current.on(`message for ${room}`, ({ message }) => {
        console.log(`event received: 'message for ' ${room}`);
        setMessages(messages => [...messages, {room, message}]);
      });
    })
  }

  return { 
    rooms, 
    messages, 
    messagesByRooms, 
    sendMessage ,
  };

}

export default useSocket;