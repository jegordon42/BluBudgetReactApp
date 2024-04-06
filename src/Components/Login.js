import React, { useState } from 'react';
import {useDispatch} from 'react-redux'
import {login} from '../Store/Actions'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import * as constants from '../constants'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, Link } from "react-router-dom";
import Paper from './Common/Paper'

export default function Login(props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const auth = getAuth();
  let navigate = useNavigate();

  function handleLogin(){
    if(isLoading)
      return
    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const token = userCredential['_tokenResponse']['idToken']
        const userId = userCredential['_tokenResponse']['localId']
        fetch(constants.url + 'Login', {
          method: "POST",
          headers: { 
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Credentials': 'true',
            "authorization" : token
          },
          body: JSON.stringify({
              userId : userId
          })
        })
        .then(response => response.json())
        .then(result => {
          if(result['message'] == 'Success'){
            result['firebaseUser'] = user
            dispatch(login(result))
            navigate('/transactions')
            setIsLoading(false)
          }
          else{
            setIsLoading(false)
            console.log(result)
            setMessage(result['message'])
          }
        })
        .catch(e => {
          setIsLoading(false)
          setMessage(e)
        });
      })
      .catch((error) => {
        setIsLoading(false)
        setMessage(error.code)
        console.log(error.message)
      });
  }

  return (
    <div style={authPage}>
      <div style={authContainer}>
        <div style={iconContainer}><LockIcon style={{color:'white'}}/></div>
        <h1 style={{fontSize:30}}>Sign In</h1>
        <Paper style={{marginTop:10}}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <h6 style={{color:"red"}}>{message}</h6>
            {!isLoading &&
              <>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                  style={{marginTop:10,marginBottom:15}}
                >
                  Sign In
                </Button>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                  <Link to={'/forgotPassword'}>
                    Forgot password?
                  </Link>
                  <Link to={'/signup'}> 
                    {"Don't have an account? Sign Up"}
                  </Link>
                </div>
              </>
            }
            {isLoading &&
            <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:15}}>
              Please wait, this may take a minute or two
              <CircularProgress style={{marginTop:20}}/>
            </div>
            }
        </Paper>
      </div>
    </div>
  );
}

const authPage = {
  flex:1, 
  display:'flex', 
  flexDirection:'row', 
  justifyContent:'center'
}
const authContainer = {
  marginTop: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width:'40%'
}
const iconContainer = {
  borderRadius:100,
  padding:7,
  backgroundColor: constants.colors.primaryColor
}