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
      setRoomNames(roomNames);
      // setConnectedSocket(socketRef.current.id);

      // set room events
      console.log('rooms in useEffect: ', rooms);
      setRoomEvents(rooms, roomNames);
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

  const setRoomEvents = (rooms, rmNames) => {
    rmNames.forEach((rmName) => {
      socketRef.current.on(`message for ${rmName}`, ({ message }) => {
        console.log(`event received: 'message for ' ${rmName}, message: ${message}`);
        addMessageToRoom(rooms, rmName, message);
      });
    })
  }

  const addMessageToRoom = (rooms, roomName, message) => {
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