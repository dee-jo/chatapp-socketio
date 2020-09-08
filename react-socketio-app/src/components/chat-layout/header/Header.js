import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import * as classes from './Header.css';

const Header = ({onLogout}) => {

  const [ activeItem, setActiveItem ] = useState('messages');

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    switch (name) {
      case 'logout': return onLogout();
      // case 'messages': () => {};
      // case 'notifications': () => {};
      // default: () => {};
    }
  };

    return (
      <Menu inverted>
        <Menu.Item
          name='logout'
          active={activeItem === 'logout'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='messages'
          active={activeItem === 'messages'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='notifications'
          active={activeItem === 'notifications'}
          onClick={handleItemClick}
        />
      </Menu>
    )
}

export default Header;

