import React, { useState } from 'react'
import { Accordion, Icon, Segment, Input } from 'semantic-ui-react'
import * as classes from './UsersSearch.css'

const UsersSearch = ({filteredUsers}) => {

  const [ activeIndex, setActiveIndex ] = useState(0);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }

  // console.log('filtered users in UsersSearch: ', filteredUsers);

  return (
    <Segment >
      {filteredUsers.map((user, i) => ( 
        <Accordion >  
          <Accordion.Title
            active={activeIndex === i}
            index={i}
            onClick={handleClick}>
            <Icon name='dropdown' />
            {user}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === i}>
          <Input
            className='messageInput'
            action='Send Message'
            actionPosition='right'
            placeholder={`Message ${user}`}
          />
          </Accordion.Content>
        </Accordion>
        ))
      }
    </Segment>
  )
      
}

export default UsersSearch;
