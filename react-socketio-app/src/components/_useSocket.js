import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';


const useSocket = () => {
  const [ messages, setMessages ] = useState([]);
  const [ rooms, setRooms ] = useState([]);
  const socketRef = useRef();

 
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on(
      "joined rooms", (rooms) => {
        setRooms(removeFirstIndex(rooms));
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

  const sendMessage = ({ message }) => {
    console.log("Message value passed to sendMessage(): ", message);
    socketRef.current.emit("chat message", { message });
  };

  const removeFirstIndex = (array) => {
    return array.filter((item, index) => {
      return index != 0;
    })
  }

  return { rooms, messages, sendMessage };

}

export default useSocket;