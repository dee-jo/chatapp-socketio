import React, { useState, useEffect } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import WarningMessage from './WarningMessage';
import * as classes from './Login.css';
import axios from 'axios';
import qs from 'querystring';



const Login = ({authenticateUser}) => {

  // form state
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirm, setPasswordConfirm ] = useState('');

  const [ isSignupMode, setIsSignupMode ] = useState(false);
  const [ signupSuccess, setSignupSuccess ] = useState(false);

  const [ nameError, setNameError ] = useState(false);
  const [ passwordError, setPasswordError ] = useState(false);
  const [ passwordConfirmError, setPasswordConfirmError ] = useState(false);
  
 

  // input handlers
  const handleNameChange = (e) => {
    const currentName = e.target.value;
    setUsername(currentName);
    if (!currentName) setNameError(true)
    else setNameError(false)
  };

  const handlePasswordChange = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    if (!currentPassword || currentPassword.length < 5 || currentPassword.length > 20) setPasswordError(true);
    else setPasswordError(false);
  };
  
  const handlePasswordConfirmChange = (e) => {
    const currentPasswordConfirm = e.target.value;
    setPasswordConfirm(currentPasswordConfirm)
    if (!currentPasswordConfirm || password != currentPasswordConfirm) setPasswordConfirmError(true);
    else setPasswordConfirmError(false);
  };


  
  // submit handlers
  const signupNewUser = () => {
    if (username && (password === passwordConfirm) && isSignupMode) {
      const payload = {
        username: username,
        password: password
      };
      axios({
        method: 'post',
        url: 'http://localhost:3001/signup',
        headers: {
          'Content-Type': 'application/json',
        },
        data:  payload,
      })
      .then(response => {
        console.log('response satatus: ', response.status);
        console.log('POST request result ', response);
        console.log('response from server: ', response.data);
        if (response.status===201) {
          setSignupSuccess(true);
          setIsSignupMode(false);
        }
      })
      .catch(error => {
        console.log('POST request error: ', error);
      })
    };
  } 

  const verifyAndRedirect = () => {
    setUsername('');
    setPassword('');
    authenticateUser(username, password);
  }
  
  const toggleSignup = () => {
    setIsSignupMode(prevstate => {
      if (!prevstate.isSignupMode) setSignupSuccess(false); 
      return !prevstate
    })
  };
  
  // renderers

  const renderSuccessMessage = () => {
    const attributes = {
      color: 'green',
      message: {
        title: 'You have successfully signed up!',
        text: 'Please log in to continue.'
      }
    }
    return <WarningMessage {...attributes} />
  }

  const renderErrorMessage = () => {
    let attributes = {};
    if (nameError) {
      attributes = { 
        negative: true, 
        message: {title: 'Username required', text: 'Please provide a valid name.'}
      };
    } 
    else if (passwordError) {
      attributes = {
         negative: true, 
         message: {title: 'Password required', text: 'Please provide a valid password.'}
      };
    } 
    else if (passwordConfirmError) {
      attributes = { 
        negative: true, 
        message: {title: 'Password confirmation required', text: 'Please confirm your password.'}
      }
    } 
    else {
      attributes = { 
        negative: true, 
        message: {title: 'Password confirmation required', text: 'Please confirm your password.'}
      }
    }
    return <WarningMessage {...attributes} />
  }

  const renderSignupForm = () => {
    return (
      <Form.Group widths='equal'>
        <Form.Field id='username'>
          <label style={{'textAlign': 'left'}}>User Name</label>
          <input placeholder='User Name' value={username} onChange={handleNameChange} error={{
        content: 'Please enter User Name',
        pointing: 'below',
      }}/>
        </Form.Field>
        <Form.Field id='password'>
          <label style={{'textAlign': 'left'}}>Password</label>
          <input placeholder='Password' value={password} onChange={handlePasswordChange} error={{
        content: 'Please enter a valid password',
        pointing: 'below',
      }}/>
        </Form.Field>
        <Form.Field id='passwordConfirm'>
          <label style={{'textAlign': 'left'}}>Confirm Password</label>
          <input placeholder='Password' value={passwordConfirm} onChange={handlePasswordConfirmChange} error={{
        content: 'Paswords need to match!',
        pointing: 'below',
      }}/>
        </Form.Field>
      </Form.Group>
    )
  }

  const renderLoginForm = () => {
    return (
      <Form.Group widths='equal'>
        <Form.Field>
          <label style={{'textAlign': 'left'}}>User Name</label>
          <input placeholder='User Name' value={username} onChange={handleNameChange} error/>
        </Form.Field>
        <Form.Field>
          <label style={{'textAlign': 'left'}}>Password</label>
          <input placeholder='Password' value={password} onChange={handlePasswordChange} error/>
        </Form.Field>
      </Form.Group>
    )
  }


  return (
    <div>
      <Grid centered >
        <Form >
          { nameError || passwordError || passwordConfirmError ? renderErrorMessage() : null }
          { signupSuccess && renderSuccessMessage()}
          { isSignupMode ? renderSignupForm() : renderLoginForm() }
          <div className='buttons'>
            <Form.Button  onClick={toggleSignup}>
              {isSignupMode ? 'Already a user, log me in!' : 'Not yet a user, sign me up!'}
            </Form.Button>
            <Form.Button 
              type='submit' 
              className={classes.login_button}
              onClick={isSignupMode ? signupNewUser : verifyAndRedirect } 
              disabled={
                isSignupMode 
                ? !username || !password || password.length < 5 || password.length > 20 || password != passwordConfirm
                : !username || !password || password.length < 5 || password.length > 20} >
              {isSignupMode ? 'Sign Up' : 'Login'}
            </Form.Button>
          </div>
        </Form>
      </Grid>
    </div>
  );
}

export default Login;

