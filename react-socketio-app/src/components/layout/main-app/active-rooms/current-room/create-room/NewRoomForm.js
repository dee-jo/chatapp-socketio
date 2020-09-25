import React, { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import * as classes from './NewRoomForm.css'


const NewRoomForm = ({sendCreatedNewRoom}) => {
  
  const [ roomInput, setRoomInput ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ checked, setChecked ] = useState(false);

  const onCreatedNewRoom = (e) => {
      sendCreatedNewRoom({
        roomName: roomInput,
        authorise: checked
      })
  }

  const handleRoomChange = (e) => {
    setRoomInput(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const toggleCheckbox = (e) => {
    setChecked(prevstate => {
      return !prevstate
    })
  }
  return (
    <Segment inverted>
      <Form inverted className='new-room_form'>
        <Form.Group widths='equal'>
          <Form.Input fluid label='room name' placeholder='room name' onChange={handleRoomChange} value={roomInput} />
          {/* <Form.Input fluid label='your name' placeholder='your name' onChange={handleNameChange} value={nameInput} /> */}
          <Form.TextArea fluid label='description' placeholder='description' onChange={handleDescriptionChange} />
        </Form.Group>
        <Form.Checkbox label='Allow users to join without approval' onClick={toggleCheckbox} />
        <Button type='submit' onClick={onCreatedNewRoom} >Submit</Button>
      </Form>
    </Segment>
  )
}

export default NewRoomForm;
