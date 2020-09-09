import React from 'react'
import { Message } from 'semantic-ui-react'

const WarningMessage = ({message, ...otherProps}) => (
  <Message {...otherProps}>
    <Message.Header>{message.title}</Message.Header>
    <p>{message.text}</p>
  </Message>
)

export default WarningMessage;