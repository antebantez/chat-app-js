import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import { Link, Navigate } from "react-router-dom"
import axios from "axios"
import Button from "react-bootstrap/Button"

const Header = ({ user, setUserCallback }) => {
  const logout = () => {
    axios.delete("http://localhost:3000/api/user/logout").then((response) => {
      setUserCallback(null)
      console.log(response.data)
    })
  }

  return (
    <>
      <Container fluid className="p-3 mb-3 header">
        <Row className="">
          <Col xs="5" sm="6" md="7" lg="7">
            <Link to="/">
              <Button variant="success  mx-1">
                <div className="header-link-div">Home</div>
              </Button>
            </Link>
          </Col>
          {!user && (
            <Col xs="2" sm="4" md="4" lg="4">
              <Link to="/login">
                <Button variant="success  mx-1">
                  <div className="header-link-div">Login/Register</div>
                </Button>
              </Link>
            </Col>
          )}
          {user && (
            <>
              <Col xs="3" sm="3" md="2" lg="2" className="float-right">
                <Link to="/chat">
                  <Button variant="success ">
                    <div className="header-link-div"> Chats</div>
                  </Button>
                </Link>
              </Col>

              <Col xs="4" sm="3" md="3" lg="3">
                <Link to="/">
                  <Button variant="success ">
                    <div
                      onClick={() => {
                        logout()
                        setUserCallback(null)
                      }}
                      className="header-link-div"
                    >
                      Log out
                    </div>
                  </Button>
                </Link>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  )
}

export default Header
