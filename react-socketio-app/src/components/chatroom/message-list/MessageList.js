import React from 'react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';

const MessageList = ({messages}) => {

  return (
    <div>

      <List divided relaxed>
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item> 
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item> 
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item> 
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item> 
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item> 
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item> 
          <List.Item>
            {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
            <List.Content>
              <List.Header>Dummy user name</List.Header>
              <List.Description>Dummy message</List.Description>
            </List.Content>
          </List.Item>   
            {messages.map(message => {
              return (<List.Item>
                {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
                <List.Content>
                  <List.Header>User name</List.Header>
                  <List.Description>{message}</List.Description>
                </List.Content>
              </List.Item>)
            })}
        </List>

    </div>
  )
}

export default MessageList;