import React, { Component, useState, useEffect }from 'react';
import { List, Input, Icon, Transition } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import useSocket from '../_useSocket';
import * as classes from './Chat.css';



const Chat = () => {

  const { messages, sendMessage } = useSocket();

  const [ messageText, setMessage ] = useState('');
  const [ visible, setVisible ] = useState(true);
 
  useEffect(() => {
    console.log("messageText: ", messageText);
    console.log("visible: ", visible);
  }, [messageText, visible]);

  const toggleArrow = () => {
    setVisible((prevState) => {
      return !prevState.visible
    })
  }  

  const updateCurrentMessage = (inputValue) => {
    setMessage(() => inputValue);
    console.log(messageText);
  }

  const onSend = () => {
    sendMessage({message: messageText});
  } 

    return (
      <div className='container'>
        <Link to='/'> 
          <Transition animation='pulse' duration={500} visible={visible}>
            <Icon name='arrow left' size='large' onMouseOver={toggleArrow} onMouseOut={toggleArrow} />
          </Transition> 
        </Link>
        
            <List divided relaxed>
                <List.Item>
                  {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
                  <List.Content>
                    <List.Header>Dummy user name</List.Header>
                    <List.Description>Dummy message</List.Description>
                  </List.Content>
                </List.Item>  
              {messages.map(message => {
                return (<List.Item>
                  {/* <List.Icon name='user_icon' size='large' verticalAlign='middle' /> */}
                  <List.Content>
                    <List.Header>User name</List.Header>
                    <List.Description>{message}</List.Description>
                  </List.Content>
                </List.Item>)
              })}
            </List>
          
            <Input 
              className='messageInput' 
              action={{content: 'Send', onClick: onSend}} 
              placeholder='Type message...' 
              onChange={(e, {value}) => updateCurrentMessage(value)}
            />
          
      </div>
    )
}


 export default Chat;



//  class Chat extends Component {

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

//  export default Chat;