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

  console.log('filtered users in UsersSearch: ', filteredUsers);

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
{/* 
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            User 2
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <Input
              className='messageInput'
              action='Send Message'
              actionPosition='right'
              placeholder='Message User 2'
            />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            User 3
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Input
              className='messageInput'
              action='Send Message'
              actionPosition='right'
              placeholder='Message User 3'
            />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 3}
            index={3}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            User 4
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 3}>
            <Input
              className='messageInput'
              action='Send Message'
              actionPosition='right'
              placeholder='Message User 4'
            />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 4}
            index={4}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            User 5
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 4}>
            <Input
              className='messageInput'
              action='Send Message'
              actionPosition='right'
              placeholder='Message User 5'
            />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 5}
            index={5}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            User 6
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 5}>
            <Input
              className='messageInput'
              action='Send Message'
              actionPosition='right'
              placeholder='Message User 6'
            />
          </Accordion.Content> */}
      
}

export default UsersSearch;
