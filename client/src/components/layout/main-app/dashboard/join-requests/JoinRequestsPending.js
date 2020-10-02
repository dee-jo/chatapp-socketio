import React from 'react';
import { List } from 'semantic-ui-react';

const JoinRequestsPending = ({joinRequestsPending}) => {

  return (
    <>
      <div className='req-list_wrapper'>
        {joinRequestsPending && <h3>Join Requests Pending:</h3>}
        <List divided verticalAlign='middle' >
          {joinRequestsPending && joinRequestsPending.map(req => 
          <>
            <List.Item key={req.id}>
              <List.Content floated='left' >{req} </List.Content>
            </List.Item>
            {/* <List.Item key={req}>
              <List.Content floated='left' >{req} </List.Content>
            </List.Item>
            <List.Item key={req}>
            <List.Content floated='left' >{req} </List.Content>
            </List.Item> */}
            </>
          )}
        </List>
      </div>
    </>
  )
}

export default JoinRequestsPending;