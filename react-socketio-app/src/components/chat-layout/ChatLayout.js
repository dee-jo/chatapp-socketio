import React, { useState, useEffect } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ChatRoom from '../chatroom/ChatRoom';
import * as classes from './ChatLayout.css'
import RoomList from './room-list/RoomList';
import useSocket from '../_useSocket';

const ChatLayout = ({roomNames, rooms, sendMessage, getMessagesForRoom, pastMessagesReceived}) => {

  const [ activeItem, setActiveItem ] = useState(roomNames[0]);
  const [ visible, setVisible ] = useState(true);
  
  const toggleArrow = () => {
    setVisible((prevState) => {
      return !prevState.visible
    })
  }  

  useEffect(() => {
    setActiveItem(roomNames[0]);
  }, [roomNames]);


  return (
    <div className='container'>
      <Link to='/'> 
          <Transition animation='pulse' duration={500} visible={visible}>
            <Icon name='arrow left' size='large' onMouseOver={toggleArrow} onMouseOut={toggleArrow} />
          </Transition> 
      </Link>

      <Grid>
        <Grid.Column width={4}>
          {activeItem && 
            <RoomList roomNames={roomNames} activeItem={activeItem} setActiveItem={setActiveItem} />
          }
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <Segment>
            {pastMessagesReceived() &&
                ( <ChatRoom 
                activeRoom={activeItem} 
                messages={getMessagesForRoom(activeItem)} 
                onSendMessage={sendMessage(activeItem)} />)
            }
            
            
            </Segment>
        </Grid.Column>
      </Grid>
  
    </div>
    
  )
}

export default ChatLayout;