import React from 'react';
import { Menu } from 'semantic-ui-react';

const UserList = ({ PMuserNames, activeTab, setActiveRoom }) => {

  console.log('in RoomList, PMuserNames: ', PMuserNames);

  const handleItemClick = (e, { name }) => setActiveRoom(name);
  console.log('active item: ', activeTab);

  return (
    <Menu fluid vertical tabular>
        {
          PMuserNames.map(room => {
            return (
              <Menu.Item
                name={room}
                key={room}
                active={activeTab === room}
                onClick={handleItemClick}
              />
            )
          })
        }
        <Menu.Item
          name='Create Room'
          active={activeTab === 'Create Room'}
          onClick={()=> {}}
        />
    </Menu>
  )
}

export default UserList;