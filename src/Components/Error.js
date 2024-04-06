import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { closeError } from '../Store/Actions';
import { Modal, Button } from 'react-bootstrap'

function Error(props) {
    const show = useSelector(state => state.showError)
    const message = useSelector(state => state.errorMessage)
    const [test, setTest] = useState('')
    const dispatch = useDispatch()
    
    const handleClose = () => {dispatch(closeError()); setTest(test + ' ')}

    return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>OOPSIE!{test}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
}

export default Error;