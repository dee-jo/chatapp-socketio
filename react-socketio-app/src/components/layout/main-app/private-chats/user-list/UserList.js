import React from 'react';
import { Menu } from 'semantic-ui-react';

const UserList = ({ PMuserNames, activeTab, PMsetActiveChat }) => {

  console.log('in RoomList, PMuserNames: ', PMuserNames);

  const handleItemClick = (e, { name }) => PMsetActiveChat(name);
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
          name='find user'
          active={activeTab === 'find user'}
          onClick={handleItemClick}
        />
    </Menu>
  )
}

export default UserList;