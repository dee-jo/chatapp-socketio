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

  // console.log('filtered users in UsersSearch: ', filteredUsers);

  return (
    <>
    <Segment className='users-search'> 
      {!filteredUsers.length && <p>No results to show!</p>}
      {filteredUsers && filteredUsers.map((receipient, i) => ( 
        <Accordion >  
          <Accordion.Title
            active={activeIndex === i}
            index={i}
            onClick={onSelectUser}>
            <Icon name='dropdown' />
            {receipient}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === i}>
          <Input
            className='findAndMessageInput'
            onChange={(e) => setPrivateMessage(e.target.value)}
            placeholder={`Message ${receipient}`} >
            <input/>
            <Button type='submit' onClick={(e) => onSendPrivateMessage(receipient)(privateMessage)}>Send Message</Button>
          </Input>
          </Accordion.Content>
        </Accordion>
        ))
      }
    </Segment>
    </>
  )
}

export default UsersSearch;
