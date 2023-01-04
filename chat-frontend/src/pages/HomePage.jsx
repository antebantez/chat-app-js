import React, {useState, useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import { Container, Row, Col } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Button  from 'react-bootstrap/Button'


function HomePage() {

  const [showLoginForm, setShowLoginForm] = useState(true)
  const [showRegistrationForm, setShowRegistrationForm] = useState(true)


  /* const startSSE = () => {
    let sse = new EventSource('/api/sse')

    sse.addEventListener('connect', message => {
      let data = JSON.parse(message.data)
      console.log('[connect]', data);
    })

    sse.addEventListener('disconnect', message => {
      let data = JSON.parse(message.data)
      console.log('[disconnect]', data);
    })

    sse.addEventListener('new-message', message => {
      let data = JSON.parse(message.data)
      console.log('[new-message]', data);
    })
  } */

  useEffect(() => {
    //startSSE()
  }, [])

  return (
    <>
      <Container>
        <Row className='mt-5'>
          <Col>
            <Card className='p-4'>
              <Row>
                <Col md={9}><h1>Welcome to chatterinomofo</h1></Col>
              
                <Col md={1}>
                  <Button
                    variant='warning'
                    onClick={() => {
                      setShowLoginForm(true)
                      setShowRegistrationForm(false)
                    }}>Login</Button>
                </Col>
                <Col md={1}>
                  <Button
                    variant='warning'
                    onClick={() => {
                      setShowLoginForm(false)
                      setShowRegistrationForm(true)
                    }}>Register</Button>
                </Col>
                

              </Row>
              <Row className='py-4'>
                {
                  showLoginForm ? <h2>Please fill in login credentials</h2>: <h2>Please fill in registration credentials</h2>
                }
                {
                  showLoginForm ? <LoginForm/> : <RegisterForm/>
                }
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default HomePage