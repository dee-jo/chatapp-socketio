import React, { Component }from 'react';
import { List, Input, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as classes from './Chat.css';

class Chat extends Component {

  render() {

    return (
      <div className='container'>
        <Link to='/'> 
          <Icon name='arrow left' size='large'/>
        </Link>
        
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