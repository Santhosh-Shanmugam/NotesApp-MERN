import React from 'react'
import {  BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Home from './pages/home/home.jsx'
import Login from './pages/login/login.jsx'
import SignUp from './pages/signup/signup.jsx'
import ProtectedRoute from './components/ProtectedRoute';

const routes = (
  <Router>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        } 
      />
    </Routes>
  </Router>
);

const App = () => {
  
  return <div>{routes}</div>;
}

export default App