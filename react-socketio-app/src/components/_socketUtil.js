import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';


const socketUtil = () => {
  const [ messages, setMessages ] = useState([]);
  const socketRef = useRef();

 
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on(
      "chat message",
      ({ message }) => {
        setMessages(messages => [...messages, message]);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = ({ message }) => {
    socketRef.current.emit("chat message", { message });
  };

  return { messages, sendMessage };

}

export default socketUtil;