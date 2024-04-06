import React, { useState } from 'react'
import * as constants from '../../constants'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from 'react-router-dom';

function Tab(props) {
  const [isHover, setIsHover] = useState(false)
  const location = useLocation()
  const active = location.pathname === '/' + props.label.toLowerCase()
  
  const buttonContainer = {
    borderBottom: active ? '3px solid white' : '',
    marginRight:15,
    marginTop:3
  } 
  const button ={
    display:'flex', 
    flexDirection:'column', 
    justifyContent:'space-between', 
    alignItems:'center',
    backgroundColor: isHover ? constants.colors.primaryColorButDarker : constants.colors.primaryColor,
    padding:5,
    borderRadius: '10px',
    cursor:'pointer',
    
  }
  const text = {
    color: active ? 'white': 'grey', 
    fontSize:12,
    marginLeft:5,
    paddingTop:0
  }
  const icon = {
    margin:0,
    fontSize:35,
    color: active ? 'white': 'grey'
  }

  const iconMap = {
    'Transactions' : <ReceiptLongIcon style={icon}/>,
    'Categories' : <DynamicFeedIcon style={icon}/>,
    'Dashboard' : <DashboardIcon style={icon}/>
  }

  return (
    <div style={{...buttonContainer, ...props.style}} >
      <div style={button} onClick={props.onClick} onMouseEnter={() => {if(!active)setIsHover(true)}} onMouseLeave={() => setIsHover(false)}>
        {props.label in iconMap && iconMap[props.label]}
        <div style={text}>{props.label}</div>
      </div>
    </div>
    
  );
}

export default Tab;