import React, { useState, useEffect } from 'react';
import Header from './header/Header';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ChatRoom from '../chatroom/ChatRoom';
import * as classes from './ChatLayout.css'
import RoomList from './room-list/RoomList';
import useSocket from '../_useSocket';

const ChatLayout = ({
  onSendMessage,
  onMessageReceived,
  checkPastMessagesReceived,
  getRooms,
  getRoomNames,
  onLogout
}) => {

  const [ activeItem, setActiveItem ] = useState(getRoomNames()[0]);
  // const [ visible, setVisible ] = useState(true);
  

  console.log(`ChatLayout mounted, messages in ${activeItem}: `, onMessageReceived(activeItem));
  
  // const toggleArrow = () => {
  //   setVisible((prevState) => {
  //     return !prevState.visible
  //   })
  // }  

  useEffect(() => {
    console.log(`ChatLayout rerendered, messages in ${activeItem}: `, onMessageReceived(activeItem));
  })

  return (
    
    <div className='container'>
      {/* <Link to='/'> 
          <Transition animation='pulse' duration={500} visible={visible}>
            <Icon name='arrow left' size='large' onMouseOver={toggleArrow} onMouseOut={toggleArrow} />
          </Transition> 
      </Link> */}

      <Header onLogout={onLogout} />

      <Grid>
        <Grid.Column width={4}>
          {activeItem && 
            <RoomList roomNames={getRoomNames()} activeItem={activeItem} setActiveItem={setActiveItem} />
          }
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <Segment>
            {getRooms() &&
                ( <ChatRoom 
                activeRoom={activeItem} 
                messages={onMessageReceived(activeItem)} 
                onSendMessage={onSendMessage(activeItem)} />)
            }
            </Segment>
        </Grid.Column>
      </Grid>
  
    </div>
    
  )
}

export default ChatLayout;