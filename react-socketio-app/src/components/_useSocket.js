import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { v4 } from 'uuid';

const useSocket = (user) => {
  const socketRef = useRef();
  // const [ connectedSocket, setConnectedSocket] = useState({});
  // const [ messages, setMessages ] = useState([{room: '', message: ''}]);

  const [ rooms, setRooms ] = useState([]);
  const [ roomNames, setRoomNames ] = useState([]);
 
  useEffect(() => {
    socketRef.current = io("http://localhost:3001", { query: user });
  
    socketRef.current.on("joined rooms", (roomNames) => {

      
      setRoomNames(roomNames);
      // setConnectedSocket(socketRef.current.id);

      console.log('rooms in useEffect: ', rooms);
      
    });
    
    socketRef.current.on("past messages", (pastMessages) => {
      console.log('recieved past messages: ', pastMessages);
      setRooms(pastMessages);
    })

    
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  

  // set room events
  useEffect(() => {
    if (roomNames.length > 0) {
      console.dir(rooms);
      console.log('setRoomEvents outer fn, rooms: ', rooms);
      roomNames.forEach((rmName) => {
        console.log(`setting event for room: ${rmName}`);
        socketRef.current.on(`message for ${rmName}`, ({ message }) => {
          console.log(`event received: 'message for ' ${rmName}, message: ${message}`);
          console.log(`rooms: `);
          console.dir(rooms);
          addMessageToRoom(rmName, message);
        });
    }); 
    }
  }, [roomNames, rooms]);
  
  
  
  const sendMessage = (room) => {
    return (messageText) => {
      const message = {
        messageid: v4(),
        date: Date.now(),
        messagetext: messageText,
        roomname: room,
        username: user
      }
      socketRef.current.emit(`message for ${room}`, {message: message});
    };
  }
  
{/* 
   const setRoomEvents = (rmNames, rooms) => {
    console.log('setRoomEvents outer fn, rooms: ', rooms);
    rmNames.forEach((rmName) => {
      console.log(`setting event for room: ${rmName}`);
      socketRef.current.on(`message for ${rmName}`, ({message}) => {
        console.log(`event received: 'message for ' ${rmName}, message: ${message}`);
        console.log(`rooms: `);
        console.dir(rooms);
        addMessageToRoom(rmName, message);
      });
    });
  }
*/}

  const addMessageToRoom = (roomName, message) => {
    console.log(`[addMessageToRoom] roomName: ${roomName}, message: `);
    console.dir(message);
    console.log(`addMessageToRoom: rooms: ${rooms}`);
  
    setRooms((prevstate) => {
      const oldMessages = prevstate[roomName].messages[0];
      const updateMessages = [...oldMessages];
      console.log('[addMessageToRoom] oldMessages', oldMessages)
      console.log('[addMessageToRoom] updateMessages', updateMessages)
      updateMessages.push(message);
      const arr = [];
      arr[0] = updateMessages;

      const updatedRoom = {
        ...prevstate[roomName],
        messages: arr
      }
      return {
        ... prevstate,
        [roomName]: updatedRoom
      }
    })
  }

  const getMessagesForRoom = (roomName) => {
    console.log('getMessagesForRoom(): roomName: ', roomName);
    console.log('getMessagesForRoom(): rooms: ', rooms);
    console.log('[getMessagesForRoom()] rooms[roomName].messages: ',rooms[roomName].messages);
    return rooms[roomName].messages[0];
  }

  return { 
    roomNames,
    getMessagesForRoom,
    sendMessage
  };

}

export default useSocket;