import React from 'react';
import RoomList from './room-list/RoomList';
import CurrentRoom from './current-room/CurrentRoom';
import { Grid, Segment } from 'semantic-ui-react';

const ActiveRooms = ({
  roomNames,
  rooms,
  activeRoom,
  setActiveRoom,
  onMessageReceived,
  onSendMessage
}) => {

  return (
    <Grid>
      <Grid.Column width={4}>
        {activeRoom && 
          <RoomList roomNames={roomNames} activeTab={activeRoom} setActiveRoom={setActiveRoom} />
        }
      </Grid.Column>
      <Grid.Column stretched width={12}>
        <Segment>
          {rooms &&
              ( <CurrentRoom 
              activeRoom={activeRoom} 
              messages={onMessageReceived(activeRoom)} 
              onSendMessage={onSendMessage(activeRoom)} />)
          }
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default ActiveRooms;