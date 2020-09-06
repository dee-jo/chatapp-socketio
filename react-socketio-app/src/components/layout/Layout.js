import React from 'react';
import ChatLayout from '../chat-layout/ChatLayout';
import Login from '../login/Login';
import { Route } from 'react-router-dom';
const Layout = (props) => {



  return (
    <div>
      <Route exact path='/' component={Login} />
      <Route path='/chat' component={ChatLayout} />
    </div>
    
  )
}
