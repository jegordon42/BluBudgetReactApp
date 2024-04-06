import React, { useState} from 'react';
import {login} from '../Store/Actions'
import {useDispatch} from 'react-redux'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import * as constants from '../constants'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import Paper from './Common/Paper'
import { Link } from 'react-router-dom';

export default function ForgotPassword(props) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const auth = getAuth();
  let navigate = useNavigate();

  function handleForgotPassword(){
    if(isLoading)
      return
    setIsLoading(true)
    sendPasswordResetEmail(auth, email, {url:'https://budgetapp-38953.firebaseapp.com', handleCodeInApp:false})
    .then(result => {
        alert('Email Sent')
        navigate('/login')
    })
    .catch((error) => {
      setIsLoading(false)
      if(error.message.includes('user-not-found'))
        alert('Account not found')
      else if(error.message.includes('invalid'))
        alert('Invalid Email')
      else if(error.message.includes('missing'))
        alert('Please enter an email')
      console.log(error.message)
    });
}

return (
  <div style={authPage}>
    <div style={authContainer}>
      <div style={iconContainer}><LockIcon style={{color:'white'}}/></div>
      <h1 style={{fontSize:30}}>Forgot Password</h1>
      <Paper style={{marginTop:10}}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          {!isLoading &&
            <>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleForgotPassword}
              >
                Send Email
              </Button>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', marginTop:10}}>
                <Link to={'/login'}> 
                  {"Sign In"}
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
width:'30%'
}
const iconContainer = {
borderRadius:100,
padding:7,
backgroundColor: constants.colors.primaryColor
}