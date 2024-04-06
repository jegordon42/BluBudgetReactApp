import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import * as constants from '../../constants'
import { useNavigate, useLocation } from "react-router-dom";
import Button from '../Common/Button'
import Tab from './Tab'
import TransactionToggle from './Filters/TransactionToggle'
import DateRange from './Filters/DateRange';
import Modal from '../Common/Modal'
import ProfileModalContent from './ProfileModalContent';
import OtherFilters from './Filters/OtherFilters';
import Tooltip from '@mui/material/Tooltip';
const dashboard = ['/transactions', '/categories', '/dashboard']

function Header(props) {
  const user = useSelector((state) => state.user)
  const incomeCategories = useSelector((state) => state.incomeCategories)
  const expenseCategories = useSelector((state) => state.expenseCategories)
  const [buttonHovered, setButtonHovered] = useState('')
  const [showModal, setShowModal] = useState('')
  const profileRef = useRef(null)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  var totalPlannedExpense = 0
  var totalPlannedIncome = 0
  incomeCategories.forEach(category => totalPlannedIncome += category.Planned);
  expenseCategories.forEach(category => totalPlannedExpense += category.Planned);
  
  const header = {
    width:'100%', 
    display:'flex', 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center',
    backgroundColor: constants.colors.primaryColor,
    paddingLeft:10,
    paddingRight:10,
    paddingTop: user && dashboard.includes(location.pathname) ? 0 : 11,
    paddingBottom: user && dashboard.includes(location.pathname) ? 0 : 11
  }

  function Logo(){
    return (
      <div style={{display:'flex', flexDirection:'row'}}>
        <img
          alt=""
          src="Blu Budget logo.png"
          width="45"
          height="45"
          className="d-inline-block align-top"
          style={{display:'inline'}}
        />
        <h1 style={title}>Blu Budget</h1>
      </div>
    )
  }

  if(location.pathname === '/setup'){
    return (
      <div style={header}>
        <Logo/>
        <div style={{color:'white', fontWeight:600, fontSize:25, flex:2, textAlign:'center'}}>
          Set Up Your Monthly Budget
        </div>
        <div style={{color:'white', flex: 1, fontWeight:600, display:'flex', flexDirection:'row', justifyContent:'space-between', marginRight:200}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{fontSize:25, margin:0}}>${totalPlannedIncome.toFixed(2)}</div>
            <div style={{fontSize:15, marginTop:-10}}>Income</div>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{fontSize:25, margin:0}}>${totalPlannedExpense.toFixed(2)}</div>
            <div style={{fontSize:15, marginTop:-10}}>Expenses</div>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{fontSize:25, margin:0}}>${(totalPlannedIncome - totalPlannedExpense).toFixed(2)}</div>
            <div style={{fontSize:15, marginTop:-10}}>Saved</div>
          </div>
        </div>
        <Button label="Finish" onClick={() => {navigate('/transactions')}} />
      </div>
    )
  }

  return (
    <div style={header}>
      <Logo/>
      {user != null && dashboard.includes(location.pathname) && (
        <div style={{height:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', flex:5, paddingRight:25, paddingLeft:50}}>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <TransactionToggle hoveredStyle={hovered} />
            <DateRange hoveredStyle={hovered}/>
              <Tooltip title="Filters">
                <div>
                  <Button onClick={() => {setShowModal('filters')}} hoveredStyle={hovered1} label='' icon='Filter' hoverColor='white' style={{marginLeft:15, height: 40, width:40}}/>
                </div>
              </Tooltip>
              <OtherFilters showModal={showModal} setShowModal={setShowModal}/>
          </div>
          <div style={tabs}>
            <Tab label="Transactions" onClick={()=>navigate('/transactions')} />
            <Tab label="Categories" onClick={()=>navigate('/categories')} />
          </div>
        </div>
      )}
      <div style={{display:'flex', flexDirection:'row'}}>
        {user != null && (
          <>
            {!dashboard.includes(location.pathname) &&
              <Button label="Dashboard" onClick={() => {navigate('/transactions')}} />
            }
            <div 
              style={[buttonHovered, showModal].includes('profile') ? {...circle,  ...hovered} : circle} 
              onClick={() => {setShowModal(showModal === 'profile' ? '' : 'profile')}}
              onMouseEnter={() => setButtonHovered('profile')} 
              onMouseLeave={() => setButtonHovered('')}
              ref={profileRef}
            >
                <h4 style={{margin:0}}>{user.firstName[0]}</h4>
            </div>
          </>
        )}  
        {user == null &&
          <Button label="Login" onClick={() => {navigate('/login')}}/>
        } 
      </div>
      <Modal show={showModal === 'profile'} style={{top:65, right: 10}} onClose={() => setShowModal('')} ignoreRef={profileRef}>
        <ProfileModalContent onClose={() => setShowModal('')}/>
      </Modal>
    </div>
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
const circle ={
  borderRadius:40,
  borderColor:'black',
  borderWidth:1,
  width:45,
  height:45,
  backgroundColor:constants.colors.primaryColorButLighter,
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  color:'white',
  marginLeft:10,
  cursor:'pointer'
}
const tabs = {
  display:'flex',
  flexDirection:'row'
}
const hovered = {
  boxShadow: '0px 0px 5px 5px ' + constants.colors.primaryColorButDarker
}

const hovered1 = {
  boxShadow: '0px 0px 3px 3px ' + constants.colors.primaryColorButDarker
}


export default Header;