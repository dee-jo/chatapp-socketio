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
  
    socketRef.current.on("joined rooms", (rooms) => {

      const roomNames = rooms.map(room => {
        return room.roomName;
      });
      setRooms(rooms);
      setRoomNames(roomNames);
      // setConnectedSocket(socketRef.current.id);

      // set room events
      console.log('rooms in useEffect: ', rooms);
     
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (roomNames) {
      setRoomEvents(roomNames);
      return;
    }
  }, [roomNames, rooms]);



  const sendMessage = (room) => {
    return ({ message }) => {
      socketRef.current.emit(`message for ${room}`, { message });
    };
  }

  const setRoomEvents = (rmNames) => {
    console.log('setRoomEvents outer fn, rooms: ', rooms);
    rmNames.forEach((rmName) => {
      console.log(`setting event for room: ${rmName}`);
      socketRef.current.on(`message for ${rmName}`, ({ message }) => {
        console.log(`event received: 'message for ' ${rmName}, message: ${message}`);
        console.log(`setRoomEvents() on event: rooms: `);
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
    const currentRoom = rooms.find(room => room.roomName === roomName);
    return currentRoom.messages;
  }

  return { 
    roomNames,
    getMessagesForRoom,
    sendMessage
  };

}

export default useSocket;