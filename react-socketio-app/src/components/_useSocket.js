import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';


const useSocket = () => {
  const [ currentRoom, setCurrentRoom ] = useState('')
  const [ messages, setMessages ] = useState([]);
  const [ rooms, setRooms ] = useState([]);
  const [ messagesByRooms, setMessagesByRooms ] = useState([]);
  const socketRef = useRef();

 
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on(
      "joined rooms", (rooms, messagesByRooms) => {
        setRooms(removeFirstIndex(rooms));
        // TODO: get messages from server for the rooms joined
      }
    );

    socketRef.current.on(
      "chat message", ({ message }) => {
        setMessages(messages => [...messages, message]);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (room) => {
    setCurrentRoom(room);
    return ({ message }) => {
      console.log("Message value passed to sendMessage(): ", message);
      // socketRef.current.emit("chat message", { message });
      if (currentRoom) {
        socketRef.current.to(currentRoom).emit("chat message", { message });
      }
    };
  }
  

  const removeFirstIndex = (array) => {
    return array.filter((item, index) => {
      return index != 0;
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