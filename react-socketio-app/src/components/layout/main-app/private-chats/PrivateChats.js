import React, { useState } from 'react';
import UserList from './user-list/UserList';
import CurrentChat from './current-chat/CurrentChat';
import { Grid, Segment } from 'semantic-ui-react';

const PrivateChats = ({
  PMuserNames,
  PMessages,
  onPrivateMessageReceived,
  onSendPrivateMessage
}) => {

  const [ PMactiveChat, PMsetActiveChat ] = useState(PMuserNames[0]);
  console.log('[PrivateChat] PMchats[username].messages: ', PMessages[PMuserNames[0]].messages)
  console.log('[PrivateChat] PMuserNames: ', PMuserNames)

  return (
    <Grid>
      <Grid.Column width={4}>
        {PMactiveChat && 
          <UserList PMuserNames={PMuserNames} activeTab={PMactiveChat} PMsetActiveChat={PMsetActiveChat} />
        }
      </Grid.Column>
      <Grid.Column stretched width={12}>
        <Segment>
          {PMessages &&
              ( <CurrentChat 
              PMactiveChat={PMactiveChat} 
              messages={onPrivateMessageReceived(PMactiveChat)} 
              onSendPrivateMessage={onSendPrivateMessage(PMactiveChat)} />)
          }
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default PrivateChats;