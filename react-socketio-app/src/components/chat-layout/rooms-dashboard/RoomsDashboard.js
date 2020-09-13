import React from 'react';
import RoomsSearch from './rooms-search/RoomsSearch';
import UsersSearch from './users-search/UsersSearch';
import * as classes from './RoomsDashboard.css';

const RoomsDashboard = ({availableRooms}) => {

  return (
    <div className='searchContainer'>
      <UsersSearch />
      <RoomsSearch availableRooms={availableRooms} />
    </div>
  )
}

export default RoomsDashboard;