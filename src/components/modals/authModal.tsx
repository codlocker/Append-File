import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../types/hooks";
import { RootState } from "../../store";
import { closeModal, setAccessToken } from "../../store/auth-slice";
import { authenticate, verifyUser, signUp } from "../../auth/authenticate";
import { TokenResponse } from "../../types/accessTokenResponse";
import { ApiResponse } from "../../types/ApiResponse";


const AuthModal = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [codeUIVisible, setCodeUIVisible] = useState<boolean>(false);
    const [confirmationCode, setConfirmationCode] = useState<string>('');

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const dispatch = useAppDispatch();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const handleClose = () => { dispatch(closeModal()); }
    const handleAuthentication = async () => {
      const res: TokenResponse = await authenticate(email, password);
      console.log(res);
      if(!res.status) {
        setError(res.message);

        if(res.error?.code === "UserNotConfirmedException") {
          if(confirmationCode.length == 0) {
            setCodeUIVisible(true);
          } else {
            if(confirmationCode.length >= 6) {
              let verify_response: ApiResponse = await verifyUser(email, confirmationCode);
              if(verify_response.status) {
                setCodeUIVisible(false);
                setError('')
                setSuccess('User Code Verified successfully!')
              }
            } else {
              setError('Enter the confirmation code to continue')
            }
          }
        } else if(res.error?.code === "NotAuthorizedException") {
          signUp(email, password);
        }

      } else {
        setSuccess(res.message);
        dispatch(setAccessToken({
          accessToken: res.accessToken,
          email: email
        }));

        dispatch(closeModal());
      }
    }

    return (
        <Modal show={useAppSelector((state: RootState) => state.auth.isLoginModal)} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Authentication
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="warning">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
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
                  placeholder="I am not a password"
                  onChange={handlePasswordChange}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="form.confirmationCode" hidden={!codeUIVisible}>
                <Form.Label>Confirmation Code</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="000000"
                  onChange = {(e) => setConfirmationCode(e.target.value)}
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAuthentication}>
              Login/ SignUp
            </Button>
          </Modal.Footer>
        </Modal>
    )
}

export default AuthModal;