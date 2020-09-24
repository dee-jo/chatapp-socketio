import React from 'react';
import { Menu } from 'semantic-ui-react';

const RoomList = ({ roomNames, currentRoom, setCurrentRoom }) => {

  const handleItemClick = (e, { name }) => setCurrentRoom(name);

  console.log('active item: ', currentRoom);

  return (
    <Menu fluid vertical tabular>
        {
          roomNames.map(room => {
            return (
              <Menu.Item
                name={room}
                key={room}
                active={currentRoom === room}
                onClick={handleItemClick}
              />
            )
          })
        }
        <Menu.Item
          name='create room'
          active={currentRoom === 'create room'}
          onClick={handleItemClick}
        />
    </Menu>
  )
}

export default RoomList;