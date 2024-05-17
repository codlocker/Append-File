import { Modal, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../types/hooks";
import { RootState } from "../../store";
import { closeModal } from "../../store/auth-slice";

const AuthModal = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useAppDispatch();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const handleClose = () => { dispatch(closeModal()); }
    return (
        <Modal show={useAppSelector((state: RootState) => state.auth.isLoginModal)} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Authentication
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="form.email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleEmailChange}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="form.password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="name@example.com"
                  onChange={handlePasswordChange}
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">
              Login/ SignUp
            </Button>
          </Modal.Footer>
        </Modal>
    )
}

export default AuthModal;