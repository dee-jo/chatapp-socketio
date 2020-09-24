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

  const [ currentRoom, setCurrentRoom ] = useState(null);
  
  useEffect(() => {
    if (rooms && roomNames) {
      // console.log('[MainApp] rooms arrived, setting active room to: ', roomNames[0])
      setCurrentRoom(roomNames[0])
    };
  }, [rooms, roomNames])

  return (
    currentRoom && currentRoom !== 'create' && 
    <Grid>
      <Grid.Column width={4}>
        {currentRoom && 
          <RoomList roomNames={roomNames} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
        }
      </Grid.Column>
      <Grid.Column stretched width={12}>
        <Segment>
          {rooms &&
              ( <CurrentRoom 
              currentRoom={currentRoom} 
              messages={currentRoom !== 'create room' && onMessageReceived(currentRoom)} 
              onSendMessage={currentRoom !== 'create room' && onSendMessage(currentRoom)} />)
          }
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default ActiveRooms;