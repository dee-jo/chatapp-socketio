import React, { useEffect, useState } from 'react';
import RoomList from './room-list/RoomList';
import CurrentRoom from './current-room/CurrentRoom';
import { Grid, Segment } from 'semantic-ui-react';

const ActiveRooms = ({
  roomNames,
  rooms,
  onMessageReceived,
  onSendMessage,
  onSendCreatedNewRoom,
  availableRooms,
  onJoinRoomsRequest,
  joinRequestSent,
  setJoinRequestSent
}) => {

  const [ currentRoom, setCurrentRoom ] = useState(null);
  
  useEffect(() => {
    if (rooms && roomNames && !currentRoom) {
      setCurrentRoom(roomNames[0])
      return
    };
  }, [rooms, roomNames])

  return (
    currentRoom && currentRoom !== 'create' && 
    <Grid>
      <Grid.Column width={4}>
        {currentRoom && 
          <RoomList roomNames={roomNames} 
                    currentRoom={currentRoom} 
                    setCurrentRoom={setCurrentRoom}  
                    />
        }
      </Grid.Column>
      <Grid.Column stretched width={12}>
        <Segment>
          {rooms &&
              ( <CurrentRoom 
                  currentRoom={currentRoom} 
                  getMessages={onMessageReceived} 
                  onSendMessage={onSendMessage} 
                  onSendCreatedNewRoom={onSendCreatedNewRoom}
                  availableRooms={availableRooms}
                  onJoinRoomsRequest={onJoinRoomsRequest}
                  joinRequestSent={joinRequestSent}
                  setJoinRequestSent={setJoinRequestSent} /> )
          }
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default ActiveRooms;