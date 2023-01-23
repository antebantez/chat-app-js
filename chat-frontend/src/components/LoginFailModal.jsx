import React from 'react'
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
const LoginFailModal = ({setModalShowCB, show}) => {
  return (
    <>
    <Modal
      show={show}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Too many tries
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <p>
          You have reached the limit of tries to login!
          </p>
          <p>
            Please try again in 1 minute!
          </p>
      </Modal.Body>
      <Modal.Footer>
          <Button className='bg-success' onClick={() => setModalShowCB(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>

)}

export default LoginFailModal