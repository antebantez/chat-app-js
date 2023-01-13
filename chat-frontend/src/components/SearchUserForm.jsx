import React, { useEffect, useState } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"

import axios from "axios"

const SearchUserForm = () => {
  const [userList, setUserList] = useState([])
  const [username, setUsername] = useState('')

  useEffect(() => {
    const getUsers = () => {
      axios
        .get(`/api/user/search?username=${username}`)
        .then((res) => {
          console.log("Users:", res.data.result)
          setUserList(res.data.result)
        })
        .catch((err) => console.log(err))
    }

    console.log(userList)
    getUsers()
  },[username])






  return (
    <>
      <Card className="p-2 m-2">
        <Form className="p-2 m-2">
          <Form.Group>
            <Form.Control
              autoComplete="off"
              className="my-2 p-3"
              type="text"
              name="username"
              value={username}
              placeholder="Search..."
              onChange={(event) => setUsername(event.target.value)}
            />
          </Form.Group>
        </Form>
        <Row className="text-center">
          <Col>
            <h3>Users</h3>
          </Col>
        </Row>
        
          {userList &&
            userList.length > 0 &&
            userList.map((user, id) => (
              <Row className="p-1 text-center justify-content-center" key={id}>
                <Col xs={4} className="bg-dark rounded text-white p-2">
                  <ListGroup.Item className="usersListGroupItem">
                    {user.user_name}
                  </ListGroup.Item>
                </Col>
              </Row>
            ))}
        
      </Card>
    </>
  )
}

export default SearchUserForm
