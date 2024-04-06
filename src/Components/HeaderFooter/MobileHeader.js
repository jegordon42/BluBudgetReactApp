import React, { useState } from 'react'
import * as constants from '../../constants'
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
const dashboard = ['/transactions', '/categories', '/dashboard']

function MobileHeader(props) {
  const [openDrawer, setOpenDrawer] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const header = {
    width:'100%', 
    display:'flex', 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center',
    backgroundColor: constants.colors.primaryColor,
    paddingLeft:10,
    paddingRight:10,
    paddingTop: 11,
    paddingBottom: 11
  }

  return (
    <>
      <div style={header}>
        <MenuIcon fontSize='large' style={{color:'white'}} onClick={() => setOpenDrawer(!openDrawer)} />
        <h1 style={title}>Blu Budget</h1>
        <img
          alt=""
          src="Blu Budget logo.png"
          width="45"
          height="45"
          className="d-inline-block align-top"
          style={{display:'inline'}}
        />
      </div>
      <SwipeableDrawer
        anchor={'left'}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
      >
        <div style={drawer}>
          <h1 style={{...title, marginBottom:20}}>Blu Budget</h1>
          <div onClick={() => {setOpenDrawer(false);navigate('/Support')}} style={option}>
            Support
          </div>
          <div onClick={() => {setOpenDrawer(false);navigate('/About')}} style={option}>
            About
          </div>
          <div onClick={() => {setOpenDrawer(false);navigate('/Terms')}} style={option}>
            Terms
          </div>
          <div onClick={() => {setOpenDrawer(false);navigate('/Privacy')}} style={option}>
            Privacy
          </div>
          <div onClick={() => {setOpenDrawer(false);navigate('/GetApp')}} style={{...option}}>
            Get The App
          </div>
        </div>
      </SwipeableDrawer>
    </>
    
  );
}

const title = {
  color:'white', 
  fontSize:30,
  fontWeight:'800',
  textAlign:'center',
  padding:0,
  margin:0,
  marginLeft:10
}

const drawer = {
  backgroundColor: constants.colors.primaryColor,
  height:'100%',
  padding:15
}

const option = {
  backgroundColor:'white',
  borderRadius:10,
  padding:5,
  textAlign:'center',
  fontWeight:600,
  marginBottom:15,
}


export default MobileHeader;