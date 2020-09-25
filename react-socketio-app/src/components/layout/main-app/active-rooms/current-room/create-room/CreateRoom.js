import React from 'react';
import NewRoomForm from './NewRoomForm';

const CreateRoom = ({sendCreatedNewRoom}) => {

  return (
    <div>
      <NewRoomForm sendCreatedNewRoom={sendCreatedNewRoom} />
    </div>
  )
}

export default CreateRoom;