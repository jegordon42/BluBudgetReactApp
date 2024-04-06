import React, { useState } from 'react'
import * as constants from '../../constants'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import DownloadIcon from '@mui/icons-material/Download';
import AddCardIcon from '@mui/icons-material/AddCard';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

function Button(props) {
  const [isHover, setIsHover] = useState(false)
  const buttonContainer = {
    display:'flex', 
    flexDirection:'row', 
    justifyContent: props.label === '' ? 'center' : 'space-between', 
    alignItems:'center',
    backgroundColor: isHover ? constants.colors.primaryColorButDarker : constants.colors.primaryColor,
    paddingTop:2,
    paddingBottom:2,
    paddingRight:10,
    paddingLeft:10,
    border: '2px solid ' + (props.hoverColor ? props.hoverColor : isHover ? 'grey' : 'white'),
    borderRadius: '10px',
    cursor:'pointer'
  } 
  const text = {
    color: props.hoverColor ? props.hoverColor : isHover ? 'grey' : 'white', 
    fontSize: props.fontSize ?? 24,
    marginLeft:5
  }
  const icon = {
    color: props.hoverColor ? props.hoverColor : isHover ? 'grey' : 'white',
    fontSize: props.fontSize ?? 24
  }

  const iconOnlyMap = {
    'Filter' : <FilterAltIcon style={icon}/>,
    'CategoryFilter' : <DynamicFeedIcon  style={icon}/>
  }

  const iconMap = {
    'Login' : <LockOpenIcon style={icon}/>,
    'Dashboard' : <DashboardIcon style={icon}/>,
    'Logout' : <ExitToAppIcon style={icon}/>,
    'Settings' : <SettingsIcon style={icon}/>,
    'Add Transaction' : <AddCardIcon style={icon}/>,
    'Add Category' : <EnhancedEncryptionIcon style={icon}/>,
    'Import' : <DownloadIcon style={icon}/>,
    '' : iconOnlyMap[props.icon]
  }

  function buttonContainerStyle(){
    var style = {...buttonContainer, ...props.style}
    if(isHover && props.hoveredStyle)
      style = {...style, ...props.hoveredStyle}
    return style
  }

  return (
    <div style={buttonContainerStyle()} onClick={props.onClick} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      {props.label in iconMap && iconMap[props.label]}
      {props.label !== '' && 
        <div style={text}>{props.label}</div>
      }
    </div>
  );
}

export default Button;