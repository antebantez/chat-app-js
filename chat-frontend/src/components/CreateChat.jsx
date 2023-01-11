import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const CreateChat = ({ setSelectedChatCallback, setNewChatCallback }) => {
  const [chatSubject, setChatSubject] = useState("")

  const navigate = useNavigate()

  const createNewChat = (event) => {
    event.preventDefault()
    axios.post("/api/chat/create", { subject: chatSubject }).then((res) => {
      console.log(res.data)
      setSelectedChatCallback(res.data.chat)
      setNewChatCallback(false)

      setChatSubject("")
    })
  }

  useEffect(() => {}, [])

  return (
    <>
      <Card className="p-2 m-2">
        <Row>
          <h3>Create New Chat</h3>
        </Row>
        <Form onSubmit={createNewChat}>
          <Form.Group>
            <Form.Control
              className="my-2"
              type="text"
              value={chatSubject}
              placeholder={"Enter Chat Subject..."}
              onChange={(event) => setChatSubject(event.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit" className="my-2">
            Create Chat
          </Button>
        </Form>
      </Card>
    </>
  )
}

export default CreateChat
