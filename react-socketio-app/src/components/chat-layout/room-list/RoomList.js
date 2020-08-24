import React from 'react';
import { Menu } from 'semantic-ui-react';

const RoomList = ({ rooms, activeItem, setActiveItem }) => {

  const handleItemClick = (e, { name }) => setActiveItem(name);
  console.log('active item: ', activeItem);

  return (

    <Menu fluid vertical tabular>
        {
          rooms.map(room => {
            return (
              <Menu.Item
                name={room}
                key={room}
                active={activeItem === room}
                onClick={handleItemClick}
              />
            )
          })
        }
        <Menu.Item
          name='Create Room'
          active={activeItem === 'Create Room'}
          onClick={handleItemClick}
        />
    </Menu>

  )
}

export default RoomList;