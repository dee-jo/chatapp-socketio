import React, { useState, useEffect } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ChatRoom from '../chatroom/ChatRoom';
import * as classes from './ChatLayout.css'
import RoomList from './room-list/RoomList';
import useSocket from '../_useSocket';

const ChatLayout = (props) => {

  const { rooms, messages, messagesByRooms, sendMessage } = useSocket();
  // console.log('rooms[0]: ', rooms[0]);
  const [ activeItem, setActiveItem ] = useState(rooms[0]);
  // console.log(activeItem);
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
            <ChatRoom activeRoom={activeItem} messages={messages} onSendMessage={(activeItem) => sendMessage(activeItem)} />
          </Segment>
        </Grid.Column>
      </Grid>
  
    </div>
    
  )
}

export default ChatLayout;