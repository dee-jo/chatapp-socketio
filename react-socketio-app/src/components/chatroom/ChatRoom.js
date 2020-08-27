import React, { Component, useState, useEffect }from 'react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import useSocket from '../_useSocket';
import * as classes from './ChatRoom.css';
import MessageInput from '../chatroom/message-input/MessageInput';
import MessageList from '../chatroom/message-list/MessageList';



const ChatRoom = ({activeRoom, messages, onSendMessage}) => {

  console.log(activeRoom);

    return (
      <div className='chat-room_container'>
        <MessageList activeRoom={activeRoom} messages={messages} />
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    )
}


export default ChatRoom;

