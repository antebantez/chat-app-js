import React, {useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const LoginForm = ({setUserCallback}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //Navigator to redirect with help of the useNavigate hook
  const navigate = useNavigate();


const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };


  const submitHandler = (event) => {
    event.preventDefault();


  
      
      axios.post('http://localhost:3000/api/user/login', {
        username: username,
        password: password
      })
        .then((response) => {
                  
                  console.log(response.data.user);
                  setUserCallback(response.data.user)
                  //after log in redirect to chat dashboard
                  
                   //TODO redirect to chat page
                  console.log(response)
                
        }).catch((error) => {
          console.log(error)
          navigate('/login')
          
          
            return
        })
    
    


    //reset the values of input fields
        
        setUsername('');
    setPassword('');
    
    navigate('/chat')
    /* return alert('Entered Values are: '+ username, password) */


  };

  return (
    <>
      <div>
    <Form onSubmit={submitHandler} autoComplete='off'>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={usernameChangeHandler}
              required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={passwordChangeHandler}
              required
            />
      </Form.Group>
      <Button variant="success" type="submit">
        Login
      </Button>
        </Form>
        
        </div>
      </>
  )
}

export default LoginForm