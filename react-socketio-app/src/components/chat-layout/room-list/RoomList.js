import React from 'react';
import { Menu } from 'semantic-ui-react';

const RoomList = ({ roomNames, activeTab, setActiveItem }) => {

  console.log('in RoomList, roomNames: ', roomNames);

  const handleItemClick = (e, { name }) => setActiveItem(name);
  console.log('active item: ', activeTab);

  return (

    <Menu fluid vertical tabular>
        {
          roomNames.map(room => {
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

export default RoomList;