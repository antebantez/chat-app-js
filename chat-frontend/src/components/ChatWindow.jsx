import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import axios from "axios"
import words from "../badWords/badWords.json"
import Filter from 'bad-words'
let sse // survives rerendering, se comment in startSSE

const ChatWindow = ({ chatData, userData, setSelectedChatCallback }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [enableChatInviting, setEnableChatInviting] = useState(false)
  const [enableChatModerating, setEnableChatModerating] = useState(false)
  const [userList, setUserList] = useState([])
  const [username, setUsername] = useState("")

  useEffect(() => {
    const getUsers = () => {
      axios
        .get(`/api/user/search?username=${username}&chatId=${chatData.chat_id}`)
        .then((res) => {
          setUserList(res.data.result)
        })
        .catch((err) => console.log(err))
    }

    
    getUsers()
  }, [username])

  const startSSE = () => {
    // workaround for being called twice in React.StrictMode
    // close the old sse connection if it exists...
    sse && sse.close()

    sse = new EventSource(`/api/sse?chatId=${chatData.chat_id}`, {
      withCredentials: true,
    })

    sse.addEventListener("connect", (message) => {
      let data = JSON.parse(message.data)
      data.chatData = chatData
    })

    sse.addEventListener("disconnect", (message) => {
      let data = JSON.parse(message.data)
      console.log("[disconnect]", data)
      sse.close()
    })

    sse.addEventListener("new-message", (message) => {
      let data = JSON.parse(message.data)
      data.chatData = chatData
      setMessages((messages) => [...messages, data])
      
      setMessage("")
    })
  }
  useEffect(() => {
    let scroll_to_bottom = document.querySelector(".chatDiv")
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight
  }, [messages])

  const getChatMessages = async (chatId) => {
    
    await axios
      .get(`/api/chat/messages/${chatId}`)
      .then((res) => {
        setMessages(res.data.result)
        //console.log("All messages", res.data.result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    startSSE()
    getChatMessages(chatData.chat_id)
    //}, [messages]);
  }, [])

  const submitMessageForm = async (event) => {

    let originalString = message
    
    //No one else can write in admin ending in message
    if (originalString.endsWith('//Admin') || originalString.endsWith('//admin')) {
      originalString = originalString.slice(0, originalString.length -7)
    }

    //Filtering out bad words from json file
    //But not words with å, ä, ö
    const badWords = words.badWords;
    let filter = new Filter()

    for (let word in badWords) {
      filter.addWords(badWords[word])
    }
    originalString = filter.clean(originalString)
    setMessage(`${originalString}`)
   
    

    event.preventDefault()
    
    

    //If admin sends the message then append //ADMIN on the end of the message
    axios
      .post("api/chat/message", {
        chatId: chatData.chat_id,
        content:
          userData.userRole == "admin"
            ? originalString + ` //ADMIN`
            : originalString,
        from: userData.username,
        fromId: userData.id,
      })
      .catch((error) => {
        console.log(error)
      })
    
  }

  const submitChatInvite = async (event) => {
    event.preventDefault()
  }

  return (
    <>
      <Card className="p-1 chatCard">
        <Row className="ms-4">
          <Col className="text-dark">
            <h2 className="text-white">{chatData.subject}</h2>
          </Col>
        </Row>
        <Row className="mb-2 text-center">
          {((userData && chatData && userData.id === chatData.created_by) ||
            userData.userRole === "admin") && (
            <>
              <Col xs="4" sm="3" md="4" lg="4" xl="2" xxl="2">
                <Button
                  variant="success"
                  onClick={() => {
                    setEnableChatInviting(true)
                    axios
                      .get("api/chat/invite", {
                        params: {
                          chatId: chatData.chat_id,
                        },
                      })
                      .then((response) => {
                        setUserList(response.data.result)
                      })
                      .catch((error) => {
                        console.log(error)
                      })
                  }}
                >
                  Invite users
                </Button>
              </Col>
              <Col xs="4" sm="3" md="4" lg="4" xl="2" xxl="2">
                <Button
                  variant="success"
                  onClick={() => {
                    setEnableChatModerating(true)
                    axios
                      .get("api/chat/users", {
                        params: {
                          chatId: chatData.chat_id,
                        },
                      })
                      .then((response) => {
                        
                        setUserList(response.data.result)
                        
                      })
                      .catch((error) => {
                        console.log(error)
                      })
                  }}
                >
                  Edit chat 🛡️{" "}
                </Button>
              </Col>
            </>
          )}
          <Col xs="1" sm="4" md="4" lg="4" xl="2" xxl="2">
            <Button
              variant="success"
              onClick={() => {
                
                axios
                  .post("api/chat/disconnect")
                  .catch((err) => console.log(err))
                setSelectedChatCallback(false)
              }}
            >
              Close 🚫
            </Button>
          </Col>
        </Row>

        <div className="chatDiv mt-3">
          {messages.length > 0 &&
            messages.map((message, id) => (
              <Col key={id}>
                <Card
                  className={
                    message.fromId === userData.id
                      ? "messageMine my-1 px-1"
                      : "messageOther my-1 px-1"
                  }
                >
                  <Col className="fw-bold">
                    {message.from}
                    {userData.userRole == 'admin' &&
                      <Button className="ms-5 bg-danger"
                        onClick={async () => {
                          await axios.delete(`/api/chat/delete-message/${message.id}`).catch(err => console.log(err))
                         await getChatMessages(chatData.chat_id)
                      }}
                      >Delete</Button>
                    }
                  </Col>
                  <Col>
                    @ ⏲{" "}
                    {new Date(message.timestamp)
                      .toISOString()
                      .slice(0, 16)
                      .split("T")
                      .join(" ")}
                  </Col>
                  <Col>{message.content}</Col>
                </Card>
              </Col>
            ))}
        </div>
        <Form onSubmit={submitMessageForm} autoComplete="on">
          <Form.Group>
            <Form.Control
              className="my-2"
              type="text"
              value={message}
              placeholder={"Type..."}
              onChange={(event) => setMessage(event.target.value)}
            />
          </Form.Group>
          <Button variant="success" onClick={() => {}} type="submit">
            Send 📨
          </Button>
        </Form>
      </Card>
      {
        <Modal show={enableChatInviting} backdrop="static" centered>
          <Modal.Header className="text-center">
            <h2>Invite users</h2>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitChatInvite}>
              <Form.Group>
                <Form.Control
                  className="m-2"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={"Find user..."}
                />
              </Form.Group>
            </Form>
            {userList.length > 0 &&
              userList.map((user, id) => (
                <Row className="text-center align-items-center m-2" key={id}>
                  <Col>{user.user_name}</Col>
                  <Col>
                    <Button
                      className="px-4"
                      variant="dark"
                      onClick={(e) => {
                        axios
                          .post(
                            `api/chat/invite?chatId=${chatData.chat_id}&userId=${user.id}`
                          )
                          .catch((error) => {
                            console.log(error)
                          })
                        e.target.disabled = true
                        e.target.textContent = "✔️"
                        e.target.style.backgroundColor = "green"
                      }}
                    >
                      ➕
                    </Button>
                  </Col>
                </Row>
              ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => setEnableChatInviting(false)}
            >
              🚫 Close
            </Button>
          </Modal.Footer>
        </Modal>
      }
      {
        <Modal show={enableChatModerating} backdrop="static" centered>
          <Modal.Header className="text-center">
            <h2>Edit chat</h2>
          </Modal.Header>
          <Modal.Body>
            {userList.length > 0 &&
              userList.map((user, id) => (
                <Row className="text-center align-items-center m-2" key={id}>
                  <Col>{user.user_name}</Col>
                  <Col>
                    <Button
                      variant={!user.banned ? "success" : "danger"}
                      onClick={(e) => {
                        axios
                          .put(
                            `api/chat/ban?chatId=${chatData.chat_id}&userId=${user.id}`
                          )
                          .catch((error) => {
                            console.log(error)
                          })
                        e.target.textContent = "✔️"
                        e.target.style.backgroundColor = "green"
                      }}
                    >
                      {!user.banned ? "🏴 Ban" : "🏳️ Unban"}
                    </Button>
                  </Col>
                </Row>
              ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="bg-success"
              onClick={() => setEnableChatModerating(false)}
            >
              🚫 Close
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  )
}

export default ChatWindow
