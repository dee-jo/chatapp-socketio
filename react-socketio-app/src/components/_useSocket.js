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

  const [ roomEventsWereSet, setEventsWereSet ] = useState(false);
  const [ rooms, setRooms ] = useState(null);
  const [ roomNames, setRoomNames ] = useState([]);

  const [ availableRooms, setAvailableRooms ] = useState(null);
  const [ availableUsers, setAvailableUsers ] = useState(null);

  const [ joinRequestSent, setJoinRequestSent ] = useState(null);
  const [ joinRequestsPending, setJoinRequestsPending ] = useState([]);
  const [ joinRequestsApproved, setJoinRequestsApproved] = useState([]);

  const [ PMUserNames, setPMUserNames ] = useState([]);
  const [ PMessages, setPMChats ] = useState(null);
  const [ PMeventsWereSet, setPMEventsWereSet ] = useState(false);

  
  // NOTIFICATIONS:
  const [ joinRequestsToApprove, setjoinRequestsToApprove ] = useState(null);
 

  // authenticate user
  const authenticateUser = (name, pass) => {
    setUsername(name);
    setPassword(pass);
  } 

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
        setUserAuthenticated(true);
        setPMEventsListeners();
        setPMEventsWereSet(true);
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
        socketRef.current.on("join room requests to approve", (join_requests) => {
          setjoinRequestsToApprove(join_requests);
        })
        socketRef.current.on("join requests pending approval", (reqs_pending) => {
          setJoinRequestsPending(reqs_pending);
        })
        socketRef.current.on("join requests approved", (reqs_approved) => {
          setJoinRequestsApproved(reqs_approved);
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


  // set chat room events
  useEffect(() => {
    if (rooms && !roomEventsWereSet) {
      setRoomEventsListeners();
      setEventsWereSet(true);
      return;
    };
  }, [rooms, roomNames, roomEventsWereSet]);

  useEffect(() => {
    if (PMessages) {
      const PMnames = Object.keys(PMessages)
      setPMUserNames([...PMnames])
    }
  }, [PMessages])

  // set private message events
  // useEffect(() => {
  //   if (PMessages && !PMeventsWereSet) {
  //     console.log('private chats have been updated! private chats: ');
  //     console.dir(PMessages);
  //     setPMEventsListeners();
  //     setPMEventsWereSet(true);
  //     return;
  //   }
  // }, [PMessages, PMUserNames, PMeventsWereSet])


  const setRoomEventsListeners = () => {
    const isPrivate = false;
    console.log('setRoomEvents outer fn, rooms: ');
    console.dir(rooms);
    
    roomNames.forEach((roomName) => {
        console.log(`setting event for room: ${roomName}`);
        socketRef.current.on(`message for ${roomName}`, ({ message }) => {
          console.log(`event received: 'message for ' ${roomName}, message: ${message}`);
          console.log(`chats: `);
          console.dir(rooms);
          addMessageToChat(roomName, message, isPrivate);
        });
    })
  }

  const setPMEventsListeners = () => {
    const isPrivate = true;
    console.log(`[setPMEventsListeners] setting private message events`);
    socketRef.current.on(`private message`, (privateMessage) => {
      addMessageToChat(privateMessage.receipientName, privateMessage, isPrivate);
      console.log(`received private message for: ' ${privateMessage.receipientName}, message: ${privateMessage.messagetext}`);
      // console.log(`private chats: `);
      // console.dir(PMessages);
    });
  }

  const addMessageToChat = (chatName, message, privateMessage) => {
    console.log(`[addMessageToChat] chatName: ${chatName}, message: `);
    console.dir(message);
    console.log(`addMessageToChat: rooms: ${rooms}`);
  
    if (privateMessage) {
      setPMChats((prevstate) => {
        return updateChatState(prevstate, chatName, message)
      })
    }
    else {
      setRooms((prevstate) => {
        return updateChatState(prevstate, chatName, message);
      });
    } 
  }

  const updateChatState = (prevstate, chatName, message, privateMessage) => {
    if (!prevstate || !prevstate[chatName]) {
      const chatMessages = [message];
      return {
        ...prevstate,
        [chatName]: {
          messages: chatMessages
        }
      }
    }
    const oldMessages = prevstate[chatName].messages;
    const updateMessages = [...oldMessages];
    console.log('[addMessageToChat] oldMessages', oldMessages)
    updateMessages.push(message);
    console.log('[addMessageToChat] updateMessages', updateMessages)

    const updatedRoom = {
      ...prevstate[chatName],
      messages: updateMessages
    }
    console.log('updatedRoom: ', updatedRoom);
    const updatedRooms = {
      ...prevstate,
      [chatName]: updatedRoom
    }
    console.log('updatedRooms: ', updatedRooms);
    return {
      ...prevstate,
      [chatName]: updatedRoom
    }
  }

  const sendPM = (receipientName) => {
    console.log(`[_useSocket] sendPM receipientName: ${receipientName}`)
    return (messageText) => {
      const longDate = new Date();
      console.log('[_useSocket] inner fn sendPM, roomName: ', receipientName);
      const privateMessage = {
        date: Date.parse(longDate) /1000,
        messagetext: messageText,
        receipientName,
        sender: username
      }
      socketRef.current.emit(`private message`, privateMessage);
    };
  }
  
  const sendMessage = (roomName) => {
    const longDate = new Date();
    return (messageText) => {
      console.log('[sendMessage@_useSocket], roomName: ', roomName);
      const message = {
        date: Date.parse(longDate) /1000,
        messagetext: messageText,
        roomname: roomName,
        username: username
      }
      socketRef.current.emit(`message for ${roomName}`, {message: message});
    };
  }

  const getMessagesForRoom = (roomName) => {
      if (rooms) {
        // console.log('getMessagesForRoom(): roomName: ', roomName);
        // console.log('getMessagesForRoom(): rooms: ', rooms);
        // console.log(`[getMessagesForRoom()] rooms[${roomName}].messages: `, rooms[roomName].messages);
        return rooms[roomName].messages;
      }
  }

  const getPrivateMessagesFromUser = (userName) => {
    if (PMessages) {
      // console.log('getMessagesForRoom(): roomName: ', roomName);
      // console.log('getMessagesForRoom(): rooms: ', rooms);
      // console.log(`[getMessagesForRoom()] rooms[${roomName}].messages: `, rooms[roomName].messages);
      return PMessages[userName].messages;
    }
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
    setjoinRequestsToApprove(prevstate => {
      const updated = prevstate.filter(req => req.id !== request.id);
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
      joinRequestSent,
      joinRequestsToApprove,
      joinRequestsPending,
      joinRequestsApproved,
      confirmJoinRequest,
      setJoinRequestSent,
      sendJoinRequest,
      getMessagesForRoom,
      sendMessage,
      getPrivateMessagesFromUser,
      PMUserNames,
      PMessages,
      sendPM
  };

}

export default useSocket;