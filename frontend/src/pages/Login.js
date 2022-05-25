import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

import './Login.css'

export default function Login() {

    return (
        <div className="login">
            <LoginForm />
        </div>
    )
}


function LoginForm() {
    const [errorMsg, setErrorMsg] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function loginIsOk(response) {
        return true;
        // if (!response.ok) {
        //     console.log(response)
        //     if (response.status === 400) {
        //         console.log("Status: " + response.status + " bad request");
        //         setErrorMsg("Username or password incorrect.");
        //     } else if (response.status === 406) {
        //         console.log("Status: " + response.status + " not acceptable");
        //         setErrorMsg("Fill in all fields");
        //     } else if (response.status === 500) {
        //         console.log("Status: " + response.status + " internal error");
        //         setErrorMsg("Interal error.");
        //     }
        //     return false;
        // } 
        //
        // if (response.status === 200) {
        //     response.text().then(token => {
        //         setCookies('token', token, {secure: false, maxAge: 1200, path: '/'});
        //         setToken(token);
        //     })
        //     return true;
        // }
    }

    async function loginClicked() {
        // const requestOptions = {
        //     headers: {'Content-type': 'application/json', token},
        //     method: "POST",
        //     body: JSON.stringify({username: username, password: password})
        // };
        //const response = await fetch(`/user/verify`, requestOptions)
       
        const response = true;

        if(loginIsOk(response)) {
            navigate("/home")
        } 
    }

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
                        <Form.Label className="float-left">Username</Form.Label>
                        <Form.Control type="user" value={username} placeholder="Username" onChange={e => {setUsername(e.target.value)}}/>
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
