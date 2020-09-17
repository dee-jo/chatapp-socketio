import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import RoomsSearch from './rooms-search/RoomsSearch';
import UsersSearch from './users-search/UsersSearch';
import * as classes from './RoomsDashboard.css';
import { filter } from 'lodash';

const RoomsDashboard = ({
  availableRooms, 
  availableUsers, 
  joinRequestSent, 
  onJoinRoomsRequest,
  setJoinRequestSent
}) => {

  const [ filteredUsers, setFilteredUsers ] = useState([]);


  const filterUsers = (e) => {
    const query = e.target.value;
    const filtered = availableUsers.filter(user => {
      return user.includes(query);
    });
    setFilteredUsers(filtered);
    console.log(query);
  }

  return (
    <div className='searchContainer'>
      <Input className='mainSearch' label='Find User' placeholder='Search...' onChange={filterUsers} />
      <UsersSearch filteredUsers={filteredUsers} />
      <RoomsSearch availableRooms={availableRooms} 
                   onJoinRoomsRequest={onJoinRoomsRequest} 
                   joinRequestSent={joinRequestSent}
                   setJoinRequestSent={setJoinRequestSent} />
    </div>
  )
}

export default RoomsDashboard;