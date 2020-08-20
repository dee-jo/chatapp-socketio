import React, { Component }from 'react';
import { List, Grid, Input } from 'semantic-ui-react';
import * as classes from './Chat.css';

class Chat extends Component {

  render() {

    return (
      <div className='container'>
        {/* <Grid centered>
          <Grid.Row> */}
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
           {/* </Grid.Row>
          
           <Grid.Row> */}
            <Input className='messageInput' action='Send' placeholder='Type message...' />
           {/* </Grid.Row>
         </Grid> */}
      </div>
    )
  }
 }

 export default Chat;