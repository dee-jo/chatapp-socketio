import React from 'react';
import { List } from 'semantic-ui-react';
import * as classes from './MessageList.css';

const MessageList = ({messages}) => {

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
            messages.map(m => {
              if (m && m.user) // TODO: there is some undefined message appended to the end of the messages array
               return (
                <List.Item>
                  {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
                  <List.Content key={m.user}>
                    <List.Header>Room {m.user}, User name</List.Header>
                    <List.Description>{m.message}</List.Description>
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