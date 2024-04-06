import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/Actions';
import { getAuth } from "firebase/auth";
import * as constants from '../../constants'
import { useNavigate } from "react-router-dom";
import Button from '../Common/Button'

function ProfileModalContent(props) {
  const user = useSelector((state) => state.user)
  const auth = getAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div style={profile}>
      <div style={circle}>
        <h1 style={{margin:0}}>{user.firstName[0]}</h1>
      </div>
      <div style={{marginTop:15, marginBottom:0}}>
        <h4 style={{margin:0}}>{user.firstName + ' ' + user.lastName}</h4>
      </div>
      <div style={{marginTop:0}}>
        {user.email}
      </div>
      <div style={{marginTop:20, marginBottom:0}}>
        <Button label="Logout" onClick={() => {props.onClose(); auth.signOut().then(()=>{dispatch(logout()); navigate('/login')})}}/>
      </div>
    </div>
  );
}

const profile = {
  width:300, 
  display:'flex',
  flexDirection:'column',
  alignItems:'center'
}
const circle ={
  borderRadius:80,
  borderColor:'black',
  borderWidth:1,
  width:80,
  height:80,
  backgroundColor:constants.colors.primaryColorButLighter,
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  color:'white',
}

export default ProfileModalContent;