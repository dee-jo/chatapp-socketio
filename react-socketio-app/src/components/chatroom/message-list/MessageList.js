import React, { useRef, useEffect } from 'react';
import { List } from 'semantic-ui-react';
import * as classes from './MessageList.css';

const MessageList = ({activeRoom, messages}) => {

  // console.log(messages);

  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesRef.current.scrollIntoView({behavior: 'smooth'});
  }

  const renderMessages = () => {
    const sortedMessages = messages.sort((a,b) => a.date - b.date);
    return messages.map(({date, messageid, messagetext, roomname, username }, i) => { 
      return (
       <List.Item>
         {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
         <List.Content key={i}>
           <List.Header>Room {activeRoom}, User name: {username}</List.Header>
           <List.Description>{messagetext}</List.Description>
         </List.Content>
       </List.Item>
     )
   })
  }

  useEffect(scrollToBottom, [messages]);

  return (
    <div>

      <List divided relaxed>
          
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item>   

          { 
            renderMessages()
          }
          <div ref={messagesRef} />
        </List>

    </div>
  )
}

export default MessageList;