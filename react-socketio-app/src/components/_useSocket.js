import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { v4 } from 'uuid';

const useSocket = (user) => {
  const socketRef = useRef();
  // const [ connectedSocket, setConnectedSocket] = useState({});
  // const [ messages, setMessages ] = useState([{room: '', message: ''}]);

  const [ rooms, setRooms ] = useState(null);
  const [ roomNames, setRoomNames ] = useState([]);
  const [ eventsWereSet, setEventsWereSet ] = useState(false);
 
  useEffect(() => {
    socketRef.current = io("http://localhost:3001", { query: user });
  
    socketRef.current.on("joined rooms", (roomNames) => {

      setRoomNames(roomNames);
      // setConnectedSocket(socketRef.current.id);

      console.log('roomsNames in useEffect: ', roomNames);
      
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
      return;
    }
  }, [rooms]);
  
  
  
  const sendMessage = (roomName) => {
    const longDate = new Date();
    return (messageText) => {
      console.log('[sendMessage@_useSocket.js], roomName: ', roomName);
      const message = {
        messageid: v4(),
        date: Date.parse(longDate) /1000,
        messagetext: messageText,
        roomname: roomName,
        username: user
      }
      socketRef.current.emit(`message for ${roomName}`, {message: message});
    };
  }

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
    if (rooms) {
      console.log('getMessagesForRoom(): roomName: ', roomName);
      console.log('getMessagesForRoom(): rooms: ', rooms);
      console.log('[getMessagesForRoom()] rooms[roomName].messages: ',rooms[roomName].messages);
      return rooms[roomName].messages[0];
    }
  }

  const pastMessagesReceived = () => {
    return rooms != null;
  }

  return { 
    roomNames,
    getMessagesForRoom,
    sendMessage,
    pastMessagesReceived
  };

}

export default useSocket;