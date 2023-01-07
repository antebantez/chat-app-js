import React, {useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { redirect } from 'react-router-dom';

const LoginForm = ({userCallback}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')




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
                  userCallback(response.data.user)
                  //after log in redirect to chat dashboard
                  
                  history.push('/dashboard') //TODO
                  console.log(response)
                
        }).catch((error) => {
          console.log(error)
          return (
            alert("Rong PASS")
          )
        })
    
    


    //reset the values of input fields
        
        setUsername('');
    setPassword('');
    
            

    return alert('Entered Values are: '+ username, password)


  };

  return (
    <>
      <div>
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={usernameChangeHandler}
              required/>
        <Form.Text className="text-muted">
          We'll never share your details with anyone else.
        </Form.Text>
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
      <Button variant="warning" type="submit">
        Login
      </Button>
        </Form>
        
        </div>
      </>
  )
}

export default LoginForm