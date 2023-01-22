import React, { useState, useEffect } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap"
import { Card, Button, OverlayTrigger, Modal, Tooltip } from "react-bootstrap"
import CreateChat from "../components/CreateChat"
import { useNavigate} from "react-router-dom"
import ChatWindow from "../components/ChatWindow"
import Dropdown from "react-bootstrap/Dropdown"
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
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (!userData) {
      navigate("/")
    }

    const getUser = () => {
      axios.get("/api/user/login").then((res) => {
        setUserCallback(res.data.user)
      })
    }

    getUser()

    getUser()
    getChats()
    getChatInvitations()
  }, [])


  const sortChatsBySubject = () => {
    let sortedChats = chats.sort((a, b) => {
      const chatSubjectA = a.subject.toUpperCase()
      const chatSubjectB = b.subject.toUpperCase()
      if (chatSubjectA < chatSubjectB) {
        return -1
      }
      if (chatSubjectA > chatSubjectB) {
        return 1
      }
      return 0
    })
    setChats([])
    setChats([...sortedChats])
  }

  const sortChatsByLatestMessage = () => {
    let sortedChats = chats.sort((a, b) => {
      const msgTimestampA = new Date(a.last_message_timestamp)
      const msgTimestampB = new Date(b.last_message_timestamp)
      if (msgTimestampA > msgTimestampB) {
        return -1
      }
      if (msgTimestampA < msgTimestampB) {
        return 1
      }
      return 0
    })
    setChats([])
    setChats([...sortedChats])
  }

  const sortChatsByUsersLatestMessage = () => {
    let sortedChats = chats.sort((a, b) => {
      const msgTimestampA = new Date(a.user_latest_message_timestamp)
      const msgTimestampB = new Date(b.user_latest_message_timestamp)
      if (msgTimestampA > msgTimestampB) {
        return -1
      }
      if (msgTimestampA < msgTimestampB) {
        return 1
      }
      return 0
    })
    setChats([])
    setChats([...sortedChats])
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Chat owner
    </Tooltip>
  )

  return (
    <>
      <Container fluid className="">
        {!selectedChat && (
          <Card className=" mb-4 chatCard">
            <Row className="">
              <Col
                xs="6"
                sm="6"
                md="6"
                lg="6"
                xl="6"
                xxl="6"
                className="ms-3 mt-2 text-white"
              >
                <h1>Your chats</h1>
              </Col>
              <Col className="mt-3">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Sort chats by
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => sortChatsBySubject()}>
                      Subject
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => sortChatsByUsersLatestMessage()}
                    >
                      Your last message
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => sortChatsByLatestMessage()}>
                      Last message
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col
                className=""
                xs="5" sm="3" md="3" lg="3" xl="3" xxl="2">
                <Button
                  className="my-3"
                  variant="success"
                  onClick={() => setShowChatInvitations(true)}
                  disabled={!chatInvitations.length > 0 ? true : false}
                >
                  Pending invites: {chatInvitations.length}
                </Button>
              </Col>
            </Row>

            {/* <Card className="p-1 m-2"> */}

            <Row className="text-white ms-1"></Row>
            <div className="chatsDiv mt-4">
              {!selectedChat &&
                chats.length > 0 &&
                !newChat &&
                chats.map((chat, id) => (
                  <Container key={id}>
                    <Row className="justify-content-center">
                      <Col xs="9" sm="8" md="7" lg="6">
                        <Card className="m-2 p-1 bg-dark">
                          <Button
                            disabled={chat.banned ? true : false}
                            className="bg-dark text-white"
                            variant="success"
                            onClick={() => {
                              setSelectedChat(chat)
                            }}
                          >
                            <Row className="text-center">
                              <Col>
                                <h5>{chat.subject}</h5>
                              </Col>
                              <h4>{chat.banned ? "[BANNED ❌]" : ""}</h4>
                              <Col>
                                {chat.created_by === userData.id && (
                                  <OverlayTrigger
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                  >
                                    <div>💎</div>
                                  </OverlayTrigger>
                                )}
                              </Col>
                            </Row>
                          </Button>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                ))}
            </div>
            {!chats.length > 0 && <div>No chats found</div>}
          </Card>
        )}
        {selectedChat ? (
          <ChatWindow
            chatData={selectedChat}
            userData={userData}
            setSelectedChatCallback={setSelectedChat}
          />
        ) : (
          <Button
            variant={!newChat ? "success mt-4" : "danger mt-4"}
            onClick={() => {
              setNewChat(!newChat)
            }}
          >
            {newChat ? "Back" : "New chat"}
          </Button>
        )}
        {!selectedChat && newChat && (
          <CreateChat
            setChatsCB={setChats}
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
                  <Col>
                    <div id="chatInvite">{chat.subject}</div>
                  </Col>
                  <Col>➡➡➡➡➡➡➡➡➡</Col>
                  <Col>
                    <Button
                      variant="success"
                      onClick={async (e) => {
                        axios
                          .put(`api/chat/accept-invite/${chat.id}`)
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
              onClick={() => {
                getChats()
                setShowChatInvitations(false)
                getChatInvitations()
              }}
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
