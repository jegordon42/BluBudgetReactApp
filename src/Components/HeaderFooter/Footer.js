import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as constants from '../../constants';

function Footer(props) {
  const device = useSelector((state) => state.device ? state.device : 'desktop')

  function FooterLink({name, page}){
    const [isHover, setIsHover] = useState(false)
    return (
      <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <Link style={isHover ? {color:'grey', textDecoration:'none'} : {color:'white'}} to={page}>{name}</Link>
      </div>
    )
  }

  return (
    <div style={footer}>
        <div style={text}>Copyright<div style={{fontSize:18, padding:3}}>{'©'}</div> BluBudget {new Date().getFullYear()}.</div>
        {device === 'desktop' &&
          <>
            <div style={divider}> | </div>
            <div style={text}><FooterLink name="Support" page="/Support"/></div>
            <div style={divider}> | </div>
            <div style={text}><FooterLink name="About" page="/About"/></div>
            <div style={divider}> | </div>
            <div style={text}><FooterLink name="Terms" page="/Terms"/></div>
            <div style={divider}> | </div>
            <div style={text}><FooterLink name="Privacy" page="/Privacy"/></div>
          </>
        }
    </div>
  );
}

const footer = {
  width:'100%', 
  display:'flex', 
  flexDirection:'row', 
  justifyContent:'center', 
  alignItems:'center',
  backgroundColor: constants.colors.primaryColor,
  padding:10,
  height:50
}
const text = {
  color:'white', 
  fontSize:12,
  fontWeight:'600',
  textAlign:'center',
  display:'flex',
  flexDirection:'row', 
  justifyContent:'space-between', 
  alignItems:'center',
  marginLeft:10,
  marginRight:10
}
const divider = {
  color:'white', 
  fontSize:19,
  fontWeight:'400',
}


export default Footer;