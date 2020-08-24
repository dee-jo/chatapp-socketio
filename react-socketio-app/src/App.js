import React from 'react';
import './App.css';
import Login from './components/login/Login';
import ChatLayout from './components/chat-layout/ChatLayout';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    
        <Route exact path='/' component={Login} />
        <Route path='/chat' component={ChatLayout} />
 
    </div>
  );
}

export default App;
