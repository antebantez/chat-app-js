import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import axios from "axios"

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

    //console.log(userList)
    getUsers()
  }, [username])

  const startSSE = () => {
    let sse = new EventSource(`/api/sse?chatId=${chatData.chat_id}`, {
      withCredentials: true,
    })

    sse.addEventListener("connect", (message) => {
      let data = JSON.parse(message.data)
      data.chatData = chatData
      console.log("[connect]", data)
    })

    sse.addEventListener("disconnect", (message) => {
      let data = JSON.parse(message.data)
      console.log("[disconnect]", data)
      sse.close()
    })

    sse.addEventListener("new-message", (message) => {
      let data = JSON.parse(message.data)
      data.chatData = chatData
      console.log("[new message]", data)
      //setMessages([...messages, data])
      //setMessages(messages.concat([data]));
      setMessages((messages) => [...messages, data])
      console.log(messages)
      setMessage("")
    })
  }

  useEffect(() => {
    startSSE()
    //}, [messages]);
  }, [])

  useEffect(() => {
    let scroll_to_bottom = document.querySelector(".chatDiv")
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight
  }, [messages])

  const getChatMessages = async (chatId) => {
    //console.log(chatId);
    /* const getChatMessagesResponse = await fetch(
      `/api/chat/message/${chatId}`
    );
    const chatMessagesJson = await getChatMessagesResponse.result.json();
    setSelectedChatMessages(chatMessagesJson); */
  }

  const submitMessageForm = async (event) => {
    event.preventDefault()
    //await postData('api/chat/message', { content: message, fromId: userData.id });
    axios
      .post("api/chat/message", {
        chatId: chatData.chat_id,
        content: message,
        from: userData.username,
        fromId: userData.id,
      })
      .then((response) => {
        console.log(response.data)
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
      <Card className="p-1 bg-light">
        <Row className="mb-2 text-center">
          <Col className="text-dark">
            <h2>{chatData.subject}</h2>
          </Col>
          <Col>
            <Button
              variant="success"
              onClick={() => {
                //  fetch('api/chat/disconnect', { method: 'POST' });
                setSelectedChatCallback(false)
              }}
            >
              🚫 Close
            </Button>
          </Col>
        </Row>
        {((userData && chatData && userData.id === chatData.created_by) ||
          userData.userRole === "admin") && (
          <Row>
            <Col>
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
                      console.log(response.data.result)
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
            <Col>
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
                      console.log(response.data)
                      setUserList(response.data.result)
                      console.log(userList)
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                }}
              >
                🛡️ Edit chat
              </Button>
            </Col>
          </Row>
        )}

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
                  <Col>{message.from}</Col>
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
              {/* <Button className="mx-2" variant="success" type="submit">
                Send invite
              </Button> */}
            </Form>
            {/* console.log(userList) */}
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
                          .then((response) => {
                            console.log(response.data)
                          })
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
            {/* <Form onSubmit={{}}>
              <Form.Group>
                <Form.Control
                  type='text'
                  placeholder={'Find user...'}
                />
              </Form.Group>
              <Button type='submit'>Send invite</Button>
            </Form> */}
            {console.log("UserList:", userList)}
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
                          .then((response) => {
                            console.log(response.data)
                          })
                          .catch((error) => {
                            console.log(error)
                          })

                        /* e.target.disabled = true */
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
            <Button onClick={() => setEnableChatModerating(false)}>
              🚫 Close
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  )
}

export default ChatWindow
