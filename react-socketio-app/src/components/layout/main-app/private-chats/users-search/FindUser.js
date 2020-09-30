import React, {useState} from 'react';
import UsersSearch from './UsersSearch';
import { Input } from 'semantic-ui-react';


const FindUser = ({onSendPrivateMessage, availableUsers}) => {

  const [ filteredUsers, setFilteredUsers ] = useState(availableUsers);

  const filterUsers = (e) => {
    const query = e.target.value;
    console.log('search query: ', query)
    if (!query) setFilteredUsers(availableUsers)
    const filtered = availableUsers.filter(user => {
      return user.includes(query);
    });
    setFilteredUsers(filtered);
    console.log(query);
  }

  return (
    <>
      <Input className='mainSearch' label='Find User' placeholder='Search...' onChange={filterUsers} />
      <UsersSearch onSendPrivateMessage={onSendPrivateMessage} filteredUsers={filteredUsers} />
    </>
  )
}

export default FindUser;