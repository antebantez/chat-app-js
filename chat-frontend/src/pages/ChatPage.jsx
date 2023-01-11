import React, { useState, useEffect } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap"
import { Card, Button, OverlayTrigger, Modal } from "react-bootstrap"
import CreateChat from "../components/CreateChat"
import { useNavigate } from "react-router-dom"
import ChatWindow from "../components/ChatWindow"
const ChatPage = ({ userData, setUserCallback }) => {
  const [chats, setChats] = useState([])
  const [chatInvitations, setChatInvitations] = useState([])
  const [showChatInvitations, setShowChatInvitations] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [newChat, setNewChat] = useState(false)
  
  const navigate = useNavigate()
  
  
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
  useEffect(() => {
  
  if (!userData) {
    navigate('/')
  }
  
  const getUser = () => {
    axios.get('/api/user/login')
    .then(res => {
        setUserCallback(res.data.user)
      })
  }

  
  getUser()

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
      <Container className="">
        {!selectedChat &&
        <Card className="p-3 mb-4 ">
          <Row className="">
            <Col>
              <h1>Your chats</h1>
            </Col>
            <Col xs={5}>
              <Button
                variant="success"
                onClick={() => setShowChatInvitations(true)}
                disabled={!chatInvitations.length > 0 ? true : false}
              >
                Pending invites: {chatInvitations.length}
              </Button>
            </Col>
          </Row>

          {/* <Card className="p-1 m-2"> */}
          <div className="chatsDiv mt-4">
            {!selectedChat &&
              chats.length > 0 &&
              !newChat &&
              chats.map((chat, id) => (
                <Card
                  className="m-2 p-4 bg-dark text-white"
                  variant="success"
                  key={id}
                  onClick={() => {
                    setSelectedChat(chat)
                  }}
                >
                  {
                    <Row className="text-center">
                      <Col>
                        <h5>{chat.subject}</h5>
                      </Col>
                      <Col>
                        {chat.created_by === userData.id && (
                          <OverlayTrigger
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                          >
                            <div>👑</div>
                          </OverlayTrigger>
                        )}
                      </Col>
                    </Row>
                  }
                </Card>
              ))}
          </div>
          {!chats.length > 0 && <div>No chats found</div>}
        </Card>}
        {selectedChat ? (
          <ChatWindow
            chatData={selectedChat}
            userData={userData}
            setSelectedChatCallback={setSelectedChat}
          />
        ) : (
          <Button
            variant="success mt-4"
            onClick={() => {
              setNewChat(true)
            }}
          >
            New chat
          </Button>
        )}
        {!selectedChat && newChat && (
          <CreateChat
            setSelectedChatCallback={setSelectedChat}
            setNewChatCallback={setNewChat}
          />
        )}
        {/* </Card> */}
        <Modal show={showChatInvitations} backdrop="static" centered>
          <Modal.Header className="text-center">
            <h2>Chat Invitations</h2>
          </Modal.Header>
          <Modal.Body>
            {chatInvitations.length > 0 &&
              chatInvitations.map((chat, id) => (
                <Row className="text-center align-items-center m-2" key={id}>
                  <Col>{chat.subject}</Col>
                  {console.log(chat)}
                  <Col>
                    <Button
                      variant="success"
                      onClick={async (e) => {
                        axios
                          .put(`api/chat/accept-invite/${chat.id}`)
                          .then((res) => {
                            console.log("success", res.data)
                          })
                          .catch((err) => console.log(err))
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
            <Button
              variant="success"
              onClick={() => setShowChatInvitations(false)}
            >
              🚫 Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  )
}
export default ChatPage
