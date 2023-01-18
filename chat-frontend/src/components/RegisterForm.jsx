import React, { useState, useEffect } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import axios from "axios"

const RegisterForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [validConfirmedPassword, setValidConfirmedPassword] = useState(false)
  
  const usernameChangeHandler = (event) => {
    setUsername(event.target.value)
  }


  const validatePassword = (e) => {
    const regex = /^(?=.*[\d!#$%&? "])(?=.*[A-Z])[a-zA-Z0-9!#$%&?]{8,}/
    console.log(e.target.value)
    console.log(regex.test(e.target.value))
    if (e.target?.value && e.target.value.match(regex)) {
      
      setValidPassword(true)
      setPassword(e.target.value)
    } else {
      setValidPassword(false)
      setPassword(e.target.value)
    }
  }

  const confirmedPasswordHandler = (event) => {
    setConfirmedPassword(event.target.value)
    
  }

  useEffect(() => {
    const passCheck = () => {

      setValidConfirmedPassword(password === confirmedPassword)
    }
    passCheck()
  },[password, confirmedPassword])

 

  const submitHandler = (event) => {

    event.preventDefault()

    axios
      .post("http://localhost:3000/api/user/register", {
        username: username,
        password: password,
      })
      .then(function (response) {
        console.log(response)
      })

    //reset the values of input fields

    setUsername("")
    setPassword("")
  }

  return (
    <>
      <div>
        <Form onSubmit={submitHandler} autoComplete="off">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={usernameChangeHandler}
              required
            />
            <Form.Text className="text-muted">
              You details are safe with me!
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className={
                validPassword || password === ""
                  ? ""
                  : "border border-warning border-4"
              }
              type="password"
              placeholder="Password..."
              value={password}
              onChange={validatePassword}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            { !validPassword && 
              <>
                <Form.Label>Minimum 8 characters</Form.Label>
                <Form.Label>Minimum 1 uppercase letter</Form.Label>
                <Form.Label>Minimum 1 number/special</Form.Label>
              </>
            }

            <Form.Control
              className={
                password === confirmedPassword || password === ""
                  ? ""
                  : "border border-warning border-4"
              }
              type="password"
              placeholder="Confirmed password..."
              value={confirmedPassword}
              onChange={confirmedPasswordHandler}
              required
            />
          </Form.Group>
          <Button
            disabled={validPassword && validConfirmedPassword ? false : true}
            variant="success"
            type="submit"
          >
            Register
          </Button>
        </Form>
      </div>
    </>
  )
}

export default RegisterForm
