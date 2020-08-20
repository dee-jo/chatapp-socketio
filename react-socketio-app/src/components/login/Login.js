import React, { Component } from 'react';
import { Form, Grid } from 'semantic-ui-react';

const options = [
  { key: 's', text: 'Male', value: 'sport' },
  { key: 'm', text: 'Female', value: 'music' },
  { key: 'w', text: 'Other', value: 'work' },
];

class Login extends Component {

  state = {};

  handleChange = (e, { value }) => this.setState({ value })

  render = () => {
    const value = this.state;
    return (
      <Grid centered >
        <Form >
          <Form.Group widths='equal'>
            <Form.Field>
              <label style={{'textAlign': 'left'}}>User Name</label>
              <input placeholder='User Name' />
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
          <Form.Button type='submit'>Submit</Form.Button>
        </Form>
       
  
      </Grid>

    );
  }
}

export default Login;

