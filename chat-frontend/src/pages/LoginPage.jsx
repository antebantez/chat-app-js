import React, { useState, useEffect } from "react"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"
import { Container, Row, Col } from "react-bootstrap"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import axios from "axios"

function LoginPage({ seshUser, setUserCallback }) {
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [user, setUser] = useState(null)

  const userCallback = (userObject) => {
    setUser(userObject)
  }


  return (
    <>
      <Container fluid>
        <Row className="mt-5">
          <Col>
            <Card className="p-4">
              {!seshUser ? (
                <Row className="">
                  <Col xs="8" sm="9" md="10" lg="10">
                    <h1 id="name">Ultrachat</h1>
                  </Col>

                  {!showLoginForm ? (
                    <Col xs={2}>
                      <Button
                        variant="success"
                        onClick={() => {
                          setShowLoginForm(true)
                          setShowRegistrationForm(false)
                        }}
                      >
                        Login
                      </Button>
                    </Col>
                  ) : (
                    <Col xs={2}>
                      <Button
                        variant="success"
                        onClick={() => {
                          setShowLoginForm(false)
                          setShowRegistrationForm(true)
                        }}
                      >
                        Register
                      </Button>
                    </Col>
                  )}
                </Row>
              ) : (
                <></>
              )}
              {!seshUser ? (
                <Row className="py-4">
                  {showLoginForm ? (
                    <h2>Login</h2>
                  ) : (
                    <h2>Please fill in credentials!</h2>
                  )}
                  {showLoginForm ? (
                    <LoginForm setUserCallback={setUserCallback} />
                  ) : (
                    <RegisterForm setShowLoginForm={setShowLoginForm} setShowRegistrationForm={setShowRegistrationForm} />
                  )}
                </Row>
              ) : (
                <Row className="text-center">
                  <h2>Welcome {seshUser.username}</h2>
                </Row>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default LoginPage
