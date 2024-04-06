import React from 'react';
import Paper from '../Common/Paper'
import { useSelector } from 'react-redux';
import { is } from 'date-fns/locale';

export default function About() {
  const isMobile = useSelector((state) => state.device === 'mobile')

  return (
    <div style={page}>
      <div style={Container}>
        <h1>About Blu Budget</h1>
        <Paper style={{marginTop:10, width:'100%', marginBottom:20}}>
          <div style={{display:'flex', flexDirection:isMobile ? 'column' : 'row', justifyContent:'center', alignItems:'center'}}>
            <div style={{display:'flex', flexDirection:'column', textAlign:'center', fontSize:25}}>
                Blu Budget was founded by Joe Gordon.
                The goal of this project was to get
                experience in app development as well as
                to get better with spending.
                Blu Budget has helped Joe achieve his goals
                and it can help you achieve yours!
            </div>
            <img
              alt=""
              src="Joe.png"
              width={isMobile ? '100' : "300"}
              height={isMobile ? '100' : "300"}
              style={{marginLeft:isMobile ? 0 : 100, marginTop:isMobile ? 20 : 0}}
            />
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