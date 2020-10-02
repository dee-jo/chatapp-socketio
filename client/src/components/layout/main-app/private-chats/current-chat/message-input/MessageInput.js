import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import * as classes from './MessageInput.css';

const MessageInput = ({onSendPrivateMessage}) => {

  const [ messageText, setMessage ] = useState('');
  
  const onSend = () => {
    setMessage('');
    console.log('sending message from MessageInput: ', messageText);
    onSendPrivateMessage(messageText);
  } 

  const updateCurrentMessage = (inputValue) => {
    setMessage(() => inputValue);
  }

  return (
    <Input 
      className='messageInput' 
      action={{content: 'Send', onClick: onSend}} 
      value={messageText}
      placeholder='Type message...' 
      onChange={(e, {value}) => updateCurrentMessage(value)}
      onKeyUp={(e) => {
        if (e.keyCode === 13) {
          onSend()
        }
      }}
    />
  )
}

export default MessageInput;