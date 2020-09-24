import React from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import * as classes from './NewRoomForm.css'

const NewRoomForm = () => (
  <Segment inverted>
    <Form inverted className='new-room_form'>
      <Form.Group widths='equal'>
        <Form.Input fluid label='room name' placeholder='room name' />
        <Form.Input fluid label='your name' placeholder='your name' />
        <Form.TextArea fluid label='description' placeholder='description' />
      </Form.Group>
      <Form.Checkbox label='Allow users to join without your approval' />
      <Button type='submit'>Submit</Button>
    </Form>
  </Segment>
)
export default NewRoomForm;
