import React, { Component } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter, Redirect } from 'react-router-dom';

const options = [
  { key: 's', text: 'Sport', value: 'sport' },
  { key: 'm', text: 'Music', value: 'music' },
  { key: 'w', text: 'Work', value: 'work' },
];

class Login extends Component {

  
  // socketManager = useSocket(USER);

  state = {
    userName: '',
    verified: false
  };


  // redirectToChat = () => {
  //   this.props.history.push(__dirname +`chat`);
  // }

  verifyAndRedirect = (userName) => {
    // TODO: verify user on server
    this.setState({verified: true});
  }

  renderRedirect = () => {
    const verified = this.state.verified;
    return verified && (
      <Redirect to='/chat'/>
    );
  }


  handleChange = (e) => this.setState({ userName: e.target.value });
  // handleSubmit = () => re

  render = () => {
    const value = this.state.userName;
    return (
      <Grid centered >
         {this.renderRedirect()}
        <Form >
          <Form.Group widths='equal'>
            <Form.Field>
              <label style={{'textAlign': 'left'}}>User Name</label>
              <input placeholder='User Name' value={value} onChange={this.handleChange}/>
            </Form.Field>
            {/* <Form.Input fluid label='User name' placeholder='User name' /> */}
            {/* <Form.Input fluid label='Password' placeholder='Password' /> */}
            
            <Form.Select
              fluid
              label='Room'
              options={options}
              placeholder='Room'
              style={{'textAlign': 'left'}}
            />
          </Form.Group>
          <Form.Button type='submit' onClick={this.verifyAndRedirect}>Submit</Form.Button>
        </Form>
       
  
      </Grid>

    );
  }
}

export default withRouter(Login);

