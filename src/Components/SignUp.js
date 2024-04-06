import React, { useState} from 'react';
import {login, isNewUser} from '../Store/Actions'
import {useDispatch} from 'react-redux'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import * as constants from '../constants'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import Paper from './Common/Paper'
import { Link } from 'react-router-dom';

export default function SignUp(props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const dispatch = useDispatch()
  const auth = getAuth();
  let navigate = useNavigate();

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

  function isValid(){
      if(firstName === "" || lastName === ""){
      setMessage("Please Fill in Name Values");
      return false;
    }
    if (!validateEmail(email)){
      setMessage("Please Enter a Valid Email Address");
      return false;
    }
    if(!acceptedTerms){
      setMessage("You cannot create an account without agreeing to the terms and privacy policy");
      return false;
    }

    return true;
  }

  function handleSignUp(){
    setMessage("");
    if(isLoading || !isValid())
      return
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;
        const token = userCredential['_tokenResponse']['idToken']
        const refreshToken = userCredential['_tokenResponse']['refreshToken']
        const userId = userCredential['_tokenResponse']['localId']

        fetch(constants.url + 'SignUp', {
          method: "POST",
          headers: { 
            "Content-type": "application/json",
            "authorization" : token
          },
          body: JSON.stringify({
              firstName, 
              lastName,
              email,
              password,
              userId
          })
        })
        .then(response => response.json())
        .then(result => {
          if(result['message'] == 'Success'){
            result['firebaseUser'] = firebaseUser
            dispatch(login(result))
            dispatch(isNewUser(true))
            navigate('/setup')
            setIsLoading(false)
          }
          else{
            console.log(result)
            setIsLoading(false)
          }
        })
        .catch(e => {
            console.log(e);
            setIsLoading(false)
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
      <h1 style={{fontSize:30}}>Sign Up</h1>
      <Paper style={{marginTop:10}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <TextField
              style={{marginRight:5, flex:1}}
              autoComplete="fname"
              variant="outlined"
              label="First Name"
              autoFocus
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              style={{marginLeft:5, flex:1}} 
              variant="outlined"
              label="Last Name"
              autoComplete="lname"
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
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
          <label>
            <input
              type="checkbox"
              checked={acceptedTerms}
              style={{marginRight:5}}
              onChange={(event)=>setAcceptedTerms(event.target.checked)} 
            />
            I agree to the
            <Link to={'/terms'} target="_blank" style={{marginLeft:5}}>{'Terms '}</Link>
            and
            <Link to={'/privacy'} target="_blank" style={{marginLeft:5}}>Privacy Policy</Link>
          </label>
          <h6 style={{color:"red"}}>{message}</h6>
          {!isLoading &&
            <>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSignUp}
              >
                Create Account
              </Button>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', marginTop:10}}>
                <Link to={'/login'}> 
                  {"Already have an account? Sign In"}
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