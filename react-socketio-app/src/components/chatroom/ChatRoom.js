import React, { Component, useState, useEffect }from 'react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import useSocket from '../_useSocket';
import * as classes from './ChatRoom.css';
import MessageInput from '../chatroom/message-input/MessageInput';
import MessageList from '../chatroom/message-list/MessageList';



const ChatRoom = ({activeRoom}) => {

  const { messages, sendMessage } = useSocket();

    return (
      <div className='chat-room_container'>
        <MessageList messages={messages} />
        <MessageInput onSendMessage={sendMessage}/>
      </div>
    )
}


 export default ChatRoom;



//  class ChatRoom extends Component {

//   state = {
//     message: '',
//     visible: true
//   }

//   toggleArrow = () => {
//     this.setState((prevState) => {
//       return {
//         visible: !prevState.visible
//       }
//     })
//   }  

//   updateCurrentMessage = (message) => {
//     this.setState(message);
//   }
  
//   render() {

//     return (
//       <div className='container'>
//         <Link to='/'> 
//           <Transition animation='pulse' duration={500} visible={this.state.visible}>
//             <Icon name='arrow left' size='large' onMouseOver={this.toggleArrow} onMouseOut={this.toggleArrow} />
//           </Transition> 
//         </Link>
        
//             <List divided relaxed>
//                 <List.Item>
//                   {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
//                   <List.Content>
//                     <List.Header>Dummy user name</List.Header>
//                     <List.Description>Dummy message</List.Description>
//                   </List.Content>
//                 </List.Item>  
//               {messages.map(message => {
//                 return (<List.Item>
//                   {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
//                   <List.Content>
//                     <List.Header>User name</List.Header>
//                     <List.Description>{message}</List.Description>
//                   </List.Content>
//                 </List.Item>)
//               })}
//             </List>
          
//             <Input 
//               className='messageInput' 
//               action='Send' 
//               placeholder='Type message...' 
//               onChange={(e) => this.updateCurrentMessage(e.target.value)}
//               onClick={() => sendMessage(this.state.message)}
//             />
          
//       </div>
//     )
//   }
//  }

//  export default ChatRoom;