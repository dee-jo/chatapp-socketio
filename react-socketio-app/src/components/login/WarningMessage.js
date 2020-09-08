import React from 'react'
import { Message } from 'semantic-ui-react'

const WarningMessage = ({message, negative}) => (
  <Message negative={negative}>
    <Message.Header>{message.title}</Message.Header>
    <p>{message.text}</p>
  </Message>
)

export default WarningMessage;