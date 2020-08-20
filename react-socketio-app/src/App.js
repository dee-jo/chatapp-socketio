import React from 'react';
import './App.css';
import Login from './components/login/Login';
import Chat from './components/chat/Chat';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    
        <Route exact path='/' component={Login} />
        <Route path='/chat' component={Chat} />
 
    </div>
  );
}

export default App;
