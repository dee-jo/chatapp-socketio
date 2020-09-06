import React, { Component, useState, useEffect } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter, Redirect } from 'react-router-dom';
import useSocket from '../_useSocket';

const options = [
  { key: 's', text: 'Sport', value: 'sport' },
  { key: 'm', text: 'Music', value: 'music' },
  { key: 'w', text: 'Work', value: 'work' },
];


const Login = (props) => {

  const [ userName, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ verified, setVerified ] = useState(false);
  const [ socketManager, setSocketManager ] = useState(useSocket());

  // redirectToChat = () => {
  //   this.props.history.push(__dirname +`chat`);
  // }

  const verifyAndRedirect = () => {
    socketManager.setUserName(userName);
    socketManager.setPassword(password);
    if (socketManager.roomNames) {
      setVerified({
        verified: true
      });
    }
  }

  const renderRedirect = () => {
    return verified && (
      <Redirect to={{
        pathname: 'chat',
        state: { useSocket: 'socketManager' }
      }}/>
      
    );
  }


  const handleNameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  // handleSubmit = () => re

    return (
      <Grid centered >
         {renderRedirect()}
        <Form >
          <Form.Group widths='equal'>
            <Form.Field>
              <label style={{'textAlign': 'left'}}>User Name</label>
              <input placeholder='User Name' value={userName} onChange={handleNameChange}/>
            </Form.Field>
            <Form.Field>
              <label style={{'textAlign': 'left'}}>Password</label>
              <input placeholder='Password' value={password} onChange={handlePasswordChange}/>
            </Form.Field>
            {/* <Form.Input fluid label='User name' placeholder='User name' /> */}
            {/* <Form.Input fluid label='Password' placeholder='Password' /> */}
            
            {/* <Form.Select
              fluid
              label='Room'
              options={options}
              placeholder='Room'
              style={{'textAlign': 'left'}}
            /> */}
          </Form.Group>
          <Form.Button type='submit' onClick={verifyAndRedirect}>Submit</Form.Button>
        </Form>
       
  
      </Grid>

    );
}

export default withRouter(Login);

