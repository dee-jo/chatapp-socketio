import React, { useState, useEffect } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ChatRoom from '../chatroom/ChatRoom';
import * as classes from './ChatLayout.css'
import RoomList from './room-list/RoomList';
import useSocket from '../_useSocket';

const ChatLayout = (props) => {

  const rooms = ['welcome', 'sport', 'music', 'dance'];

  const { messages, sendMessage } = useSocket();

  const [ activeItem, setActiveItem ] = useState(rooms[0]);
  const [ visible, setVisible ] = useState(true);

  
  
  const toggleArrow = () => {
    setVisible((prevState) => {
      return !prevState.visible
    })
  }  

  useEffect(() => {
    console.log("visible: ", visible);
  }, [visible]);


  return (
    <div className='container'>

      <Link to='/'> 
          <Transition animation='pulse' duration={500} visible={visible}>
            <Icon name='arrow left' size='large' onMouseOver={toggleArrow} onMouseOut={toggleArrow} />
          </Transition> 
      </Link>

      <Grid>
        <Grid.Column width={4}>
          <RoomList rooms={rooms} activeItem={activeItem} setActiveItem={setActiveItem} />
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <Segment>
            <ChatRoom activeRoom={activeItem} messages={messages} onSendMessage={sendMessage} />
          </Segment>
        </Grid.Column>
      </Grid>
  
    </div>
    
  )
}

export default ChatLayout;