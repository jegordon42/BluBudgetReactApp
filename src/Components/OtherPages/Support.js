import React from 'react';
import Paper from '../Common/Paper'
import { useSelector } from 'react-redux';

export default function Support() {
  const isMobile = useSelector((state) => state.device === 'mobile')
  
  return (
    <div style={page}>
      <div style={Container}>
        <h1>Support</h1>
        <Paper style={{marginTop:10, marginBottom:20}}>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
            <h2 style={{textAlign:'center'}}>How To Use BluBudget</h2>
            <div style={{display:'flex', flexDirection:isMobile ? 'column' : 'row', justifyContent:'space-between'}}>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', flex:1, marginTop:20}}>
                <h4>Step 1</h4>
                Create categories and spending goals
              </div>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', flex:1, marginTop:20}}>
                <h4>Step 2</h4>
                Keep track of your spending by recording your transactions
              </div>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', flex:1, marginTop:20}}>
                <h4>Step 3</h4>
                Meet your spending goals and look at trends in your spending
              </div>
            </div>
            <h2 style={{marginTop:50, textAlign:'center'}}>Questions?</h2>
            <h4 style={{textAlign:'center'}}>Contact us at support@blubudget.com</h4>
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