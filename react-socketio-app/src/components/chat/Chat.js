import React, { Component }from 'react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as classes from './Chat.css';

class Chat extends Component {

  state = {
    visible: true
  }

  toggleArrow = () => {
    this.setState((prevState) => {
      return {
        visible: !prevState.visible
      }
    })
  }  
  
  render() {

    return (
      <div className='container'>
        <Link to='/'> 
          <Transition animation='pulse' duration={500} visible={this.state.visible}>
            <Icon name='arrow left' size='large' onMouseOver={this.toggleArrow} onMouseOut={this.toggleArrow} />
          </Transition> 
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