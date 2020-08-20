import React from 'react';
import './App.css';
import Login from './components/login/Login';
import Chat from './components/chat/Chat';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path='/' component={Login} />
        <Route path='/chat' component={Chat} />
      </Router>
    </div>
  );
}

export default App;
