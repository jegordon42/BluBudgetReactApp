import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '../Common/Paper';
import BarChart from './BarChart'
import Metrics from './Metrics';
import TransactionsGrid from './TransactionsGrid'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { isNewUser } from '../../Store/Actions';

function TransactionsPage(props) {
  const type = useSelector((state) => state.filters.type)
  const isNew = useSelector((state) => state.isNewUser)
  const [showModal, setShowModal] = useState(isNew)
  const dispatch = useDispatch()

  function Message(){
    dispatch(isNewUser(false))
    return(
      <Dialog disableEscapeKeyDown open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle style={{fontSize:25, textAlign:'center'}}>Welcome to Blu Budget!</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection:'column'}}>
            Create transactions and keep track of your spending. Happy budgeting!
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
        <div style={{marginRight:10, flex:1, display:'flex', flexDirection:'column'}}>
          <Paper style={{marginBottom:10}}>
            <Metrics/>
          </Paper>
          <Paper style={{height:'100%'}}>
            <BarChart />
          </Paper>
        </div>
        <Paper style={{flex:1, height:'100%', paddingRight:0, paddingLeft:0, paddingBottom:0}}>  
          <TransactionsGrid TransactionType = {type} />
        </Paper>
      </div>
      <Message />
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

export default TransactionsPage;
