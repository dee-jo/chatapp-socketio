import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import * as classes from './Header.css';

const Header = ({onLogout, activeTab, setActiveTab}) => {

  const handleItemClick = (e, { name }) => {
    setActiveTab(name);
    switch (name) {
      case 'logout': return onLogout();
      // case 'messages': () => {};
      // case 'notifications': () => {};
      // case 'dashboard: () => {};
      // default: () => {};
    }
  };

    return (
      <Menu inverted>
        <Menu.Item
          name='logout'
          active={activeTab === 'logout'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='messages'
          active={activeTab === 'messages'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='notifications'
          active={activeTab === 'notifications'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='dashboard'
          active={activeTab === 'dashboard'}
          onClick={handleItemClick}
        />
      </Menu>
    )
}

export default Header;

