import React from 'react';
import { List } from 'semantic-ui-react';
import * as classes from './MessageList.css';

const MessageList = ({activeRoom, messages}) => {

  console.log(messages);

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
            messages.map(({user: messageUser, message}, i) => {
             
               return (
                <List.Item>
                  {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
                  <List.Content key={i}>
                    <List.Header>Room {activeRoom}, User name: {messageUser}</List.Header>
                    <List.Description>{message}</List.Description>
                  </List.Content>
                </List.Item>
              )
            })
          }
        </List>

    </div>
  )
}

export default MessageList;