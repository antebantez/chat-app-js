import React, { useState, useEffect } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {Container, Row, Col} from "react-bootstrap"

const LoginForm = ({ setUserCallback }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  //Navigator to redirect with help of the useNavigate hook
  const navigate = useNavigate()

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value)
  }

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value)
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    await axios
      .post("http://localhost:3000/api/user/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        setUserCallback(response.data.user)
      })
      .catch((error) => {
        console.log(error)
        navigate("/chat")
        return
      })
    //reset the values of input fields
    setUsername("")
    setPassword("")
    navigate("/chat")
  }

  return (
    <>
      <Container >
        <Form onSubmit={submitHandler} autoComplete="off">
          <Row>
            <Col xs="10" sm="8" md="8" lg="7">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={usernameChangeHandler}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs="10" sm="8" md="8" lg="7">
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
            </Col>
          </Row>
          <Button variant="success" type="submit">
            Login
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default LoginForm
