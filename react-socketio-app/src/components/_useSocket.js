import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';


const useSocket = () => {
  const socketRef = useRef();
  // const [ connectedSocket, setConnectedSocket] = useState({});
  const [ messages, setMessages ] = useState([{room: '', message: ''}]);
  const [ rooms, setRooms ] = useState([]);
  const [ roomNames, setRoomNames ] = useState([]);
 
  useEffect(() => {
    socketRef.current = io("http://localhost:3001", { query: "user=user1" });
  
    socketRef.current.on("joined rooms", (rooms) => {

      const roomNames = rooms.map(room => {
        return room.roomName;
      });
      setRoomNames(roomNames);
      // setConnectedSocket(socketRef.current.id);

      // set room events
      setRoomEvents(roomNames);
      setRooms(rooms);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (room) => {
    return ({ message }) => {
      socketRef.current.emit(`message for ${room}`, { message });
    };
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
    roomNames,
    rooms, 
    messages, 
    sendMessage
  };

}

export default useSocket;