import React, { Component }from 'react';
import { List, Grid, Input, Icon } from 'semantic-ui-react';
import * as classes from './Chat.css';

class Chat extends Component {

  render() {

    return (
      <div className='container'>
        
            <List divided relaxed>
              <List.Item>
                {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
                <List.Content>
                  <List.Header>User name</List.Header>
                  <List.Description>Message</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
                <List.Content>
                  <List.Header>User name</List.Header>
                  <List.Description>Message</List.Description>
                </List.Content>
              </List.Item>
            </List>
          
            <Input className='messageInput' action='Send' placeholder='Type message...' />
          
      </div>
    )
  }
 }

 export default Chat;