import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const HomePage = (seshUser) => {
  return (
    <>
      {! seshUser ? <Card className='my-5 p-4 text-center'>
      <Container >
        <Row className=''>
          <Col><h2>Welcome to das dunderchatten</h2></Col>
        </Row>
        <Row>
          
            <Col>
            <h4>
              What would you like to do?
            </h4>
            <Link to="/login">
            <Button className='bg-success'>Login / Register</Button>
            </Link>
            </Col>
        
        </Row>
      </Container>
      </Card>
        :
        <Row className='justify-content-center text-center my-4'>
          
          <Col sm="10">
            <Card>
            <h1>Welcome to dunderchatteroni</h1>
            <br />
            <img src="../../assets/pngwing.com.png" />
            <h3>Please choose one of the links above to get going</h3>
            </Card>
            </Col>
        </Row>}
    </>
  )
}

export default HomePage