import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';


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
      setRoomEvents(roomNames, rooms);
    }
  }, [roomNames, rooms]);
  
  
  
  const sendMessage = (room) => {
    return ({ message }) => {
      socketRef.current.emit(`message for ${room}`, { message });
    };
  }
  
  const setRoomEvents = (rmNames, rooms) => {
    console.log('setRoomEvents outer fn, rooms: ', rooms);
    rmNames.forEach((rmName) => {
      console.log(`setting event for room: ${rmName}`);
      socketRef.current.on(`message for ${rmName}`, ({ message }) => {
        console.log(`event received: 'message for ' ${rmName}, message: ${message}`);
        console.log(`rooms: `);
        console.dir(rooms);
        addMessageToRoom(rmName, message);
      });
    });
  }

  const addMessageToRoom = (roomName, message) => {
    console.log(`addMessageToRoom: rooms: ${rooms}`);
    const newMessage = {
      user, message
    }
    let room_index = 0;
    const currentRoom = rooms.find((r,i) => {
      room_index = i;
      return r.roomName === roomName
    });

    console.log('message passed to addMessageToRoom: ', newMessage);
    console.log('currentRoom.messages: ', currentRoom.messages);
    const updatedMessages = [...currentRoom.messages];
    updatedMessages.push(newMessage);
    console.log('updatedMessages', updatedMessages);

    const updatedRoom = {...currentRoom};
    updatedRoom.messages = updatedMessages;
    const updatedAllRooms = [...rooms];
    updatedAllRooms[room_index] = updatedRoom; 
    setRooms(updatedAllRooms);
    // console.log(updatedAllRooms);
  }

  const getMessagesForRoom = (roomName) => {
    console.log('getMessagesForRoom(): roomName: ', roomName);
    console.log('getMessagesForRoom(): rooms: ', rooms);
    console.log('[getMessagesForRoom()] rooms[roomName].messages: ',rooms[roomName].messages);
    return rooms[roomName].messages;
  }

  return { 
    roomNames,
    getMessagesForRoom,
    sendMessage
  };

}

export default useSocket;