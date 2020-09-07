import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { v4 } from 'uuid';

const useSocket = (isVerifiedCallback) => {
  const socketRef = useRef();
  // const [ connectedSocket, setConnectedSocket] = useState({});
  // const [ messages, setMessages ] = useState([{room: '', message: ''}]);

  const [ username, setUsername ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const [ userAuthenticated, setUserAuthenticated ] = useState(false);
  const [ rooms, setRooms ] = useState(null);
  const [ roomNames, setRoomNames ] = useState([]);
  const [ eventsWereSet, setEventsWereSet ] = useState(false);
 
  useEffect(() => {
    if (username && password) {
      socketRef.current = io("http://localhost:3001");

      socketRef.current.on('connect', () => {
        console.log('Socket connected: ', socketRef.current.socket);
        console.log('username: ', username, 'password: ', password);
        socketRef.current.emit('authentication', {username: username, password: password});
      });
      socketRef.current.on("user not verified", () => {
        // redirect to login
      })
      socketRef.current.on('authenticated', function() {
        setUserAuthenticated(true);
        socketRef.current.on("joined rooms", (roomNames) => {
          setRoomNames(roomNames);
          // setConnectedSocket(socketRef.current.id);
          console.log('roomsNames in useEffect: ', roomNames);
        });
        socketRef.current.on("past messages", (pastMessages) => {
          console.log('recieved past messages: ', pastMessages);
          setRooms(pastMessages);
        })
      });
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [username, password]);

  

  // set room events
  useEffect(() => {
    console.log('rooms have been updated! rooms: ');
    console.dir(rooms);
    if (rooms && !eventsWereSet) {
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
      setEventsWereSet(true);
      if (rooms) isVerifiedCallback(roomNames, rooms, sendMessage, getMessagesForRoom);
      return;
    };
  }, [rooms]);

  const authenticateUser = (username, password) => {
    setUsername(username);
    setPassword(password);
  }
  
  const sendMessage = (roomName) => {
    const longDate = new Date();
    return (messageText) => {
      console.log('[sendMessage@_useSocket.js], roomName: ', roomName);
      const message = {
        messageid: v4(),
        date: Date.parse(longDate) /1000,
        messagetext: messageText,
        roomname: roomName,
        username: username
      }
      socketRef.current.emit(`message for ${roomName}`, {message: message});
    };
  }

  const addMessageToRoom = (roomName, message) => {
    console.log(`[addMessageToRoom] roomName: ${roomName}, message: `);
    console.dir(message);
    console.log(`addMessageToRoom: rooms: ${rooms}`);
  
    setRooms((prevstate) => {
      const oldMessages = prevstate[roomName].messages;
      const updateMessages = [...oldMessages];
      console.log('[addMessageToRoom] oldMessages', oldMessages)
      updateMessages.push(message);
      console.log('[addMessageToRoom] updateMessages', updateMessages)

      const updatedRoom = {
        ...prevstate[roomName],
        messages: updateMessages
      }
      console.log('updatedRoom: ', updatedRoom);
      const updatedRooms = {
        ...prevstate,
        [roomName]: updatedRoom
      }
      console.log('updatedRooms: ', updatedRooms);
      return {
        ... prevstate,
        [roomName]: updatedRoom
      }
    });
  }

  const getMessagesForRoom = (roomName) => {
      if (rooms) {
        console.log('getMessagesForRoom(): roomName: ', roomName);
        console.log('getMessagesForRoom(): rooms: ', rooms);
        console.log(`[getMessagesForRoom()] rooms[${roomName}].messages: `, rooms[roomName].messages);
        return rooms[roomName].messages;
      }
  }

  return { 
      authenticateUser,
      userAuthenticated,
      roomNames,
      rooms,
      getMessagesForRoom,
      sendMessage
  };

}

export default useSocket;