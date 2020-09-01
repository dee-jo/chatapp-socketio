import React from 'react';
import { Menu } from 'semantic-ui-react';

const RoomList = ({ roomNames, activeItem, setActiveItem }) => {

  console.log('in RoomList, roomNames: ', roomNames);

  const handleItemClick = (e, { name }) => setActiveItem(name);
  console.log('active item: ', activeItem);

  return (

    <Menu fluid vertical tabular>
        {
          roomNames.map(room => {
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
          onClick={()=> {}}
        />
    </Menu>

  )
}

export default RoomList;