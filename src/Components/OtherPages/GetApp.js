import React from 'react';
import Paper from '../Common/Paper'

export default function GetApp() {

  return (
    <div style={page}>
      <div style={Container}>
        <h1>Get The App!</h1>
        <Paper style={{marginTop:10, width:'100%', }}>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <div style={{display:'flex', flexDirection:'column', textAlign:'center'}}>
                The Blu Budget web app is not available on mobile.<br/><br/>
                Visit us on a desktop <br/>
                or <br/>
                download the beta version of the
                <a href="https://testflight.apple.com/join/weOkGT0z"> mobile app!</a>
            </div>
          </div>
          
        </Paper>
      </div>
    </div>
  );
  }
  
  const page = {
  flex:1, 
  display:'flex', 
  flexDirection:'row', 
  justifyContent:'center'
  }
  const Container = {
  marginTop: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width:'80%'
  }