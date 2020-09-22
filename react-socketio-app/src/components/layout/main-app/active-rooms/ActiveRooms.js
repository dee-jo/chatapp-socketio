import React, { useEffect, useState } from 'react';
import RoomList from './room-list/RoomList';
import CurrentRoom from './current-room/CurrentRoom';
import { Grid, Segment } from 'semantic-ui-react';

const ActiveRooms = ({
  roomNames,
  rooms,
  onMessageReceived,
  onSendMessage
}) => {

  const [ activeRoom, setActiveRoom ] = useState(null);
  
  useEffect(() => {
    if (rooms && roomNames) {
      console.log('[MainApp] rooms arrived, setting active room to: ', roomNames[0])
      setActiveRoom(roomNames[0])
    };
  }, [rooms, roomNames])

  return (
    activeRoom &&<Grid>
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