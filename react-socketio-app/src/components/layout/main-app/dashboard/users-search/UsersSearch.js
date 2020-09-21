import React, { useState } from 'react'
import { Accordion, Icon, Segment, Input, Button } from 'semantic-ui-react'
import * as classes from './UsersSearch.css'

const UsersSearch = ({filteredUsers, onSendPrivateMessage}) => {

  const [ activeIndex, setActiveIndex ] = useState(0);
  const [ privateMessage, setPrivateMessage ] = useState('');

  const onSelectUser = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }

  const onSendPM = (e) => {
    
  }

  // console.log('filtered users in UsersSearch: ', filteredUsers);

  return (
    <Segment className='users-search'>
      {filteredUsers.map((user, i) => ( 
        <Accordion >  
          <Accordion.Title
            active={activeIndex === i}
            index={i}
            onClick={onSelectUser}>
            <Icon name='dropdown' />
            {user}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === i}>
          <Input
            className='messageInput'
            actionPosition='right'
            onChange={(e) => setPrivateMessage(e.target.value)}
            placeholder={`Message ${user}`} >
            <input/>
            <Button type='submit' onClick={(e) => onSendPrivateMessage(user, privateMessage)}>Send Message</Button>
          </Input>
          </Accordion.Content>
        </Accordion>
        ))
      }
    </Segment>
  )
      
}

export default UsersSearch;
