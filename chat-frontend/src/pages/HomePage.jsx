import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

const HomePage = (seshUser) => {
  return (
    <>
      {/* {!seshUser ? (
        <Card className="my-5 p-4 text-center">
          <Container>
            <Row className="">
              <Col>
                <h2>Welcome to the UltraChat</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>What would you like to do?</h4>
                <Link to="/login">
                  <Button className="bg-success">Login / Register</Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </Card>
      ) : ( */}
      <Container>
        <Row className="justify-content-center text-center my-4">
          <Col sm="10">
            <Card className="m-2 p-2">
              <h1>Welcome to the UltraChat</h1>
              <h4>(The natural choice)</h4>
              <br />
              <div>
                <img id="bild" src="../../assets/pngwing.com.png" />
              </div>
              <h4>Please choose one of the links above to get started</h4>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default HomePage
