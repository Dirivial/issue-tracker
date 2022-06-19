import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useCookies } from 'react-cookie';
import { AccountContext } from '../context.js';

import { useState, useContext, useEffect } from 'react';

import RegisterPopup from '../components/RegisterUserPopup.js';

import './Login.css'

export default function Login() {

    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    
    return (
        <div className="login">
            <LoginForm />
            <div className="btnLoginRow">
                <Button className="btnLogin" onClick={() => setShowRegisterPopup(true)}>Not registered?</Button>
            </div>

            <RegisterPopup
                show={showRegisterPopup}
                onHide={() => {setShowRegisterPopup(false)}}
            />
        </div>
    )
}


function LoginForm() {
    const [errorMsg, setErrorMsg] = useState(null);
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookies] = useCookies(['token']);
    const navigate = useNavigate();
    const {token, setToken} = useContext(AccountContext);

    function loginIsOk(response) {
        if (response.status !== 200) {
            console.log(response)
            if (response.status === 400) {
                console.log("Status: " + response.status + " bad request");
                setErrorMsg("Username or password incorrect.");
            } else if (response.status === 406) {
                console.log("Status: " + response.status + " not acceptable");
                setErrorMsg("Fill in all fields");
            } else if (response.status === 500) {
                console.log("Status: " + response.status + " internal error");
                setErrorMsg("Interal error.");
            }
            return false;
        }
       
        console.log("Response: " + response.data);
        console.log("Response token: " + response.data.token);
        setCookies('token', response.data.token, {secure: false, maxAge: 1200, path: '/'});
        setToken(response.token);
        return true;
    }

    async function loginClicked() {
        Axios.post('http://localhost:3001/verify',
            {
                mail: mail,
                password: password
            }).then((response) => {
                console.log(response);
                if(loginIsOk(response)) {
                    navigate("/home");
                }
            }).catch((error) => {
                console.log("Cronge");
        });
    }

    useEffect(() => {
        if (cookies.token) {
            navigate('/home');
        }
    })

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            loginClicked().then(r => {})
        }
    }

    return (
        <div className="loginform-thing">
            <div className="loginFormWrapper" style={{ maxWidth: 750}}>
                <form style={{ maxWidth: 700}} className="">
                    <Form.Group className="loginInput" controlId="formBasicEmail">
                        <Form.Label className="float-left">E-mail</Form.Label>
                        <Form.Control type="email" value={mail} placeholder="E-mail" onChange={e => {setMail(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group className="loginInput" controlId="formBasicPassword">
                        <Form.Label className="float-left">Password</Form.Label>
                        <Form.Control type="password" value={password} placeholder="Password" onKeyDown={e => {handleKeyDown(e)}} onChange={e => {setPassword(e.target.value)}} />
                    </Form.Group>
                    <div className="row btnLoginRow">
                        <Button className="btnLogin" onClick={loginClicked} >
                        Log in
                        </Button>
                    </div>
                    {errorMsg ? <p style={{color: 'red'}}>{errorMsg}</p> : null}
                </form>                

            </div>

        </div>
    )
}
