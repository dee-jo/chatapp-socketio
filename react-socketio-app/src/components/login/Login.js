import React, { Component, useState, useEffect } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, withRouter, Redirect } from 'react-router-dom';
import useSocket from '../_useSocket';
import ChatLayout from '../chat-layout/ChatLayout';

const options = [
  { key: 's', text: 'Sport', value: 'sport' },
  { key: 'm', text: 'Music', value: 'music' },
  { key: 'w', text: 'Work', value: 'work' },
];


const Login = ({authenticateUser}) => {

  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
 

  // redirectToChat = () => {
  //   this.props.history.push(__dirname +`chat`);
  // }

  const verifyAndRedirect = () => {
    authenticateUser(username, password);
  }


  // const renderRedirect = () => {
  //   console.log('socketManager@Login: ');
  //   console.dir(socketManager);
  //   return erified && (
  //     <Redirect to={{
  //       pathname: '/chat',
  //       state: { useSocket: socketManager }
  //     }}/>
      
  //   );
  // }


  const handleNameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  // handleSubmit = () => re

    return (
      <div>
        <Grid centered >
          <Form >
            <Form.Group widths='equal'>
              <Form.Field>
                <label style={{'textAlign': 'left'}}>User Name</label>
                <input placeholder='User Name' value={username} onChange={handleNameChange}/>
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
        
      </div>
    );
}

export default Login;

