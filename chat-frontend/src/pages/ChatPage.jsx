import React, { useState, useEffect } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap"
import { Card, Button, OverlayTrigger, Modal } from "react-bootstrap"
import CreateChat from "../components/CreateChat"
const ChatPage = ({ userData, setUserCallback }) => {
  const [chats, setChats] = useState([])
  const [chatInvitations, setChatInvitations] = useState([])
  const [showChatInvitations, setShowChatInvitations] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [newChat, setNewChat] = useState(false)


  

  useEffect(() => {

    const getUser = () => {
      axios.get('/api/user/login')
      .then(res => {
          setUserCallback(res.data.user)
        })
    }
  
  getUser()
    const getChats = () => {
      axios
        .get("/api/chats")
        .then((res) => {
          setChats(res.data.result)
          console.log(res.data.result)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const getChatInvitations = () => {
      axios
        .get("/api/chat/invites")
        .then((res) => {
          setChatInvitations(res.data.result)
          console.log(res.data.result)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    getUser()
    getChats()
    getChatInvitations()
  }, [])

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Chat owner
    </Tooltip>
  )

  return (
    <>
    
      <Container>
        <Card className="p-1">
          <Row>
            <Col>
              <h2>hej's chats</h2>
            </Col>
            <Col xs={5}>
              <Button
                variant="success"
                onClick={() => setShowChatInvitations(true)}
                disabled={!chatInvitations.length > 0 ? true : false}
              >
                Pending invites
              </Button>
            </Col>
          </Row>

          <Card className="p-1 m-2 bg-danger">
            {!selectedChat &&
              chats.length > 0 &&
              !newChat &&
              chats.map((chat, id) => (
                <Button
                  variant="success"
                  key={id}
                  onclick={() => {
                    setSelectedChat(chat)
                  }}
                >
                  { <Row className="text-center">
                  <Col>{chat.subject}</Col>
                    <Col>
                      {chat.created_by === userData.id && 
                        <OverlayTrigger
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip}>
                          <div>👑</div>
                        </OverlayTrigger>
                      }
                    </Col>
                  </Row> }
                  
                  
                </Button>
))}
            {!chats.length > 0 && <div>No chats found</div>}
          </Card>
          {selectedChat ? (
            <ChatWindow
              chatData={selectedChat}
              userData={userData}
              setSelectedChatCallback={setSelectedChat}
            />
          ) : (
            <Button variant="success mt-4" onclick={() => setNewChat(true)}>New chat</Button>
          )}
          {!selectedChat && newChat && (
            <CreateChat
              setSelectedChatCallback={setSelectedChat}
              setNewChatCallback={setNewChat}
            />
          )}
        </Card>
        <Modal show={showChatInvitations} backdrop="static" centered>
          <Modal.Header className="text-center">
            <h2>Chat Invitations</h2>
          </Modal.Header>
          <Modal.Body>
            {chatInvitations.length > 0 &&
              chatInvitations.map((chat, id) => (
                <Row className="text-center align-items-center m-2" key={id}>
                  <Col>{chat.chat_subject}</Col>
                  <Col>
                    <Button
                      onClick={async (e) => {
                        /* await fetch(`api/chat/accept-invite/${chat.id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        })
                          .then((res) => res.json())
                          .then((data) => console.log(data))
                          .catch((err) => console.log(err.message)) */
                        axios.put(`api/chat/accept-invite/${chat.id}`)
                          .then((res) => {
                          console.log("success", res.data)
                        }).catch(err => console.log(err))
                        e.target.disabled = true
                        e.target.textContent = "✅"
                        e.target.style.backgroundColor = "green"
                      }}
                    >
                      Join
                    </Button>
                  </Col>
                </Row>
              ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setShowChatInvitations(false)}>
              🚫 Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  )
}
export default ChatPage
