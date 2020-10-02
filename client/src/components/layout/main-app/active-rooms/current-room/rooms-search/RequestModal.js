import React, { useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'


const RequestModal = ({openModal, setJoinRequestSent}) => {
  
  const [ open, setOpenModal] = useState(openModal);

  const onButtonClick = () => {
    setJoinRequestSent(false);
    setOpenModal(false)
  }

  return (
      <Modal
        size='mini'
        open={open}
        onClose={onButtonClick} >
        <Modal.Header>Join Request Successful!</Modal.Header>
        <Modal.Content>
          <p>You'll be notified once the room admin accepts your request.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={onButtonClick}>
            Ok
          </Button>
        </Modal.Actions>
      </Modal>
  )
}

export default RequestModal;
