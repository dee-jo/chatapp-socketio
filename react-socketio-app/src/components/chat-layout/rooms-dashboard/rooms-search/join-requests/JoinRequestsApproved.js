import React from 'react';
import { List } from 'semantic-ui-react';
import * as classes from './JoinRequests.css'

const JoinRequestsApproved = ({joinRequestsApproved}) => {

  return (
    <>
      <div className='req-list_wrapper'>
        <h3>Approved requests:</h3>
        <List divided verticalAlign='middle'>
          {joinRequestsApproved && joinRequestsApproved.map(req => 
            <>
              <List.Item key={req.id}>
                <List.Content floated='left' >{req} </List.Content>
              </List.Item>
              <List.Item key={req.id}>
                <List.Content floated='left' >{req} </List.Content>
              </List.Item>
              <List.Item key={req.id}>
                <List.Content floated='left' >{req} </List.Content>
              </List.Item>
            </>
          )}
        </List>
      </div>
    </>
  )
}

export default JoinRequestsApproved;