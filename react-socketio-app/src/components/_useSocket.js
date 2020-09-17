import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { v4 } from 'uuid';
import axios from 'axios';

const useSocket = () => {
  const socketRef = useRef();

  const [ username, setUsername ] = useState(null);
  const [ password, setPassword ] = useState(null);

  const [ userAuthenticated, setUserAuthenticated ] = useState(false);
  const [ userUnauthorised, setUserUnauthorised ] = useState(false);
  const [ eventsWereSet, setEventsWereSet ] = useState(false);
  const [ rooms, setRooms ] = useState(null);
  const [ roomNames, setRoomNames ] = useState([]);

  const [ availableRooms, setAvailableRooms ] = useState(null);
  const [ availableUsers, setAvailableUsers ] = useState(null);

  const [ joinRequestSent, setJoinRequestSent ] = useState(null);
  const [ joinRoomsSuccess, setJoinRoomsSuccess ] = useState(false);

  // NOTIFICATIONS:
  const [ joinRequestsReceived, setJoinRequestsReceived ] = useState(null);
 
  // authenticate user
  useEffect(() => {
    if (username && password) {
      socketRef.current = io("http://localhost:3001");

      socketRef.current.on('connect', () => {
        console.log('Socket connected: ', socketRef.current.socket);
        // console.log('username: ', username, 'password: ', password);
        socketRef.current.emit('authentication', {username: username, password: password});
      });
      socketRef.current.on("unauthorized", () => {
        setUserUnauthorised(true);
        setUserAuthenticated(false);
        setUsername(null);
        setPassword(null);
        // redirect to login
      })
      socketRef.current.on('authenticated', function() {
        
        socketRef.current.on("joined rooms", (roomNames) => {
          setRoomNames(roomNames);
          // setConnectedSocket(socketRef.current.id);
          console.log('roomsNames in useEffect: ', roomNames);
        });
        socketRef.current.on("past messages", (pastMessages) => {
          console.log('recieved past messages: ', pastMessages);
          setRooms(pastMessages);
        })
        socketRef.current.on("available rooms", (availableRooms) => {
          setUserAuthenticated(true);
          setAvailableRooms(availableRooms);
        })
        socketRef.current.on("join room requests", (join_requests) => {
          setJoinRequestsReceived(join_requests);
        })
        socketRef.current.on("available users", (availableUsers) => {
          setAvailableUsers(availableUsers);
        })
      });
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [username, password]);

  useEffect(() => {
    console.log('[useSocket], availableRooms: ', availableRooms);
  }, [availableRooms])


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
      setUserAuthenticated(true);
      return;
    };
  }, [rooms]);

  const authenticateUser = (name, pass) => {
    setUsername(name);
    setPassword(pass);
  }

  const signupNewUser = (newName, newPassword) => {
    // console.log('[_useSocket@signupNewUser]')
      const payload = {
        username: newName,
        password: newPassword
      };
      return axios({
        method: 'post',
        url: 'http://localhost:3001/signup',
        headers: {
          'Content-Type': 'application/json',
        },
        data:  payload,
      })
  } 

  const sendJoinRequest = (rooms) => {
    const payload = {
      rooms: rooms,
      username: username
    };
    return axios({
      method: 'post',
      url: 'http://localhost:3001/joinRooms',
      headers: {
        'Content-Type': 'application/json',
      },
      data:  payload,
    })
    .then(res => {
      if (res.status === 200) {
        setJoinRequestSent({requestedRooms: rooms});
        setAvailableRooms(prevstate => {
          const updatedAvailableRooms = prevstate.filter((room) => {
            return !rooms.includes(room);
          })
          console.log('[_useSocket], updatedAvailableRooms', updatedAvailableRooms);
          return [...updatedAvailableRooms]
        })
      }
    })
  }

  const confirmJoinRequest = (request) => {
    socketRef.current.emit('confirm join request', request);
    setJoinRequestsReceived(prevstate => {
      const updated = prevstate.filter(req => req.id != request.id);
      return [...updated];
    }) 
  }


  const logoutUser = () => {
    setUserAuthenticated(false);
    setUsername(null);
    setPassword(null);
    setRooms(null);
    setRoomNames(null);
    setEventsWereSet(null);
    // socketRef.current = null;
    return socketRef.current.disconnect();
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
        // console.log('getMessagesForRoom(): roomName: ', roomName);
        // console.log('getMessagesForRoom(): rooms: ', rooms);
        // console.log(`[getMessagesForRoom()] rooms[${roomName}].messages: `, rooms[roomName].messages);
        return rooms[roomName].messages;
      }
  }

  return { 
      authenticateUser,
      signupNewUser,
      logoutUser,
      userAuthenticated,
      userUnauthorised,
      roomNames,
      rooms,
      availableRooms,
      availableUsers,
      joinRoomsSuccess,
      joinRequestSent,
      joinRequestsReceived,
      confirmJoinRequest,
      setJoinRequestSent,
      sendJoinRequest,
      getMessagesForRoom,
      sendMessage
  };

}

export default useSocket;