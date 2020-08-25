import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import * as classes from './MessageInput.css';

const MessageInput = ({onSendMessage}) => {

  const [ messageText, setMessage ] = useState('');
  
  const onSend = () => {
    console.log('sending message from MessageInput: ', messageText);
    onSendMessage({message: messageText});
  } 

  const updateCurrentMessage = (inputValue) => {
    setMessage(() => inputValue);
  }
 
  useEffect(() => {
    console.log("messageText: ", messageText);
  }, [messageText]);



  return (
    <Input 
      className='messageInput' 
      action={{content: 'Send', onClick: onSend}} 
      placeholder='Type message...' 
      onChange={(e, {value}) => updateCurrentMessage(value)}
    />
  )
}

export default MessageInput;