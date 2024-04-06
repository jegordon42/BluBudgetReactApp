import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import Paper from './Common/Paper'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SetUpGrid from './Categories/SetUpGrid'


function SetUp(props) {
  const [showModal, setShowModal] = useState(true)

  function Message(){
    return(
      <Dialog disableEscapeKeyDown open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle style={{fontSize:25, textAlign:'center'}}>Set Up Your Categories</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection:'column'}}>
              We've started you out with a couple of examples. Customize your categories to create a budget that works for you!
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <>
      <div style={page}>
        <Paper style={{flex:1, height:'100%', paddingRight:0, paddingLeft:0, paddingBottom:0, marginRight:5}}>  
          <SetUpGrid type="Income"/>
        </Paper>
        <Paper style={{flex:1, height:'100%', paddingRight:0, paddingLeft:0, paddingBottom:0, marginLeft:5}}>  
          <SetUpGrid type="Expenses"/>
        </Paper>
      </div>
      <Message/>
    </>
    
  );
}

const page = {
  display:'flex',
  flexDirection:'row',
  padding:10,
  width:'100%',
  height:'100%'
}

export default SetUp;
