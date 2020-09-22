import React from 'react'
import { Menu } from 'semantic-ui-react'
import * as classes from './Header.css';

const Header = ({activeTab, setActiveTab}) => {

  const handleItemClick = (e, { name }) => {
    setActiveTab(name);
  };

  return (
    <Menu inverted>
      <Menu.Item
        name='logout'
        active={activeTab === 'logout'}
        onClick={handleItemClick}
      />
      <Menu.Item
        name='your-rooms'
        active={activeTab === 'your rooms'}
        onClick={handleItemClick}
      />
      <Menu.Item
        name='private-chats'
        active={activeTab === 'private chats'}
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

