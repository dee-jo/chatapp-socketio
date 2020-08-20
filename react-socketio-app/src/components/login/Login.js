import React, { Component } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

const options = [
  { key: 's', text: 'Sport', value: 'sport' },
  { key: 'm', text: 'Music', value: 'music' },
  { key: 'w', text: 'Work', value: 'work' },
];

class Login extends Component {

  state = {userName: ''};

  redirectToChat = () => {
    this.props.history.push(__dirname +`chat`);
  }


  handleChange = (e) => this.setState({ userName: e.target.value });
  // handleSubmit = () => re

  render = () => {
    const value = this.state.userName;
    return (
      <Grid centered >
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
          <Form.Button type='submit' onClick={this.redirectToChat}>Submit</Form.Button>
        </Form>
       
  
      </Grid>

    );
  }
}

export default withRouter(Login);

