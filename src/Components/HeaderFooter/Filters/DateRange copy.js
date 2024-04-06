import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import * as constants from '../../../constants'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Modal from '../../Common/Modal';
import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { setFilter } from '../../../Store/Actions';

const dateOptions = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Last 3 Months', 'This Year', 'Last Year']

function DateRange(props) {
  const [isHover, setIsHover] = useState('')
  const [isButtonHover, setIsButtonHover] = useState(false)
  const [showModal, setShowModal] = useState('')
  const customRef = useRef(null)
  const optionsRef = useRef(null)
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)
  const dispatch = useDispatch()

  const buttonContainer = {
    display:'flex', 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center',
    backgroundColor: constants.colors.primaryColor,
    paddingTop:2,
    paddingBottom:2,
    border: '2px solid white',
    borderRadius: '17px',
    marginLeft:10
  } 
  const text = {
    color: 'white', 
    fontSize:22,
    textAlign:'center',
    borderTopLeftRadius: '17px',
    borderBottomLeftRadius: '17px',
    cursor:'pointer',
    marginTop:-2,
    marginBottom:-2,
    paddingLeft:10,
    paddingRight:10
  }
  const divider = {
    color: 'white', 
    fontSize:25,
    marginTop:-10,
    marginBottom:-5,
    fontWeight:'100'
  }
  const carrot = {
    color: 'white', 
    fontSize:22,
    textAlign:'center',
    cursor:'pointer',
    paddingRight:5,
    borderTopRightRadius: '17px',
    borderBottomRightRadius: '17px',
    marginBottom:-2,
    marginTop:-2
  }

  function buttonContainerStyle(){
    var style = {...buttonContainer}
    if(isButtonHover && props.hoveredStyle)
      style = {...style, ...props.hoveredStyle}
    return style
  }

  function onSelectDateOption(dateOption){
    var startDate = new Date(); 
    var endDate = new Date();
    
    if(dateOption === 'Last 7 Days')
        startDate.setDate(startDate.getDate() - 6)
    else if(dateOption === 'Last 14 Days')
        startDate.setDate(startDate.getDate() - 13)
    else if(dateOption === 'Last 30 Days')
        startDate.setDate(startDate.getDate() - 29)
    else if(dateOption === 'This Month')
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    else if(dateOption === 'Last Month'){
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1)
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
        endDate.setDate(endDate.getDate() - 1)
    }
    else if(dateOption === 'Last 3 Months')
        startDate = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 2, 1)
    else if(dateOption === 'This Year')
        startDate = new Date(startDate.getFullYear(), 0, 1)
    else if(dateOption === 'Last Year'){
        startDate = new Date(startDate.getFullYear() - 1, 0, 1)
        endDate = new Date(endDate.getFullYear() - 1, 11, 31)
    }

    dispatch(setFilter('date', {startDate, endDate}))
    //props.forceRerender()
    setShowModal('')
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div 
        style={buttonContainerStyle()} 
        onClick={props.onClick}
        onMouseEnter={() => {setIsButtonHover(true)}} 
        onMouseLeave={() => setIsButtonHover(false)}
      >
        <div 
          style={isHover === 'date' ? {...text, backgroundColor:constants.colors.primaryColorButDarker} : text} 
          onMouseEnter={() => {setIsHover('date')}} 
          onMouseLeave={() => setIsHover('')}
          onClick={() => {setShowModal(showModal === 'custom' ? '' : 'custom')}}
          ref={customRef}
        >
          {startDate.toLocaleDateString('en-US') + " - " + endDate.toLocaleDateString('en-US')}
        </div>
        <div style={divider}>|</div>
        <div
          style={isHover === 'carrot' ? {...carrot, backgroundColor:constants.colors.primaryColorButDarker} : carrot} 
          onMouseEnter={() => {setIsHover('carrot')}} 
          onMouseLeave={() => setIsHover('')}
          onClick={() => {setShowModal(showModal === 'options' ? '' : 'options')}}
          ref={optionsRef}
        >
          <ArrowDropDownIcon/>
        </div>
        <Modal show={showModal === 'custom'} style={{top:55}} paperStyle={{padding:0}} onClose={() => setShowModal('')} ignoreRef={customRef}>
          <StaticDateRangePicker
            displayStaticWrapperAs="desktop"
            value={[startDate, endDate]}
            onChange={(newValue) => {
              if(newValue[0] && newValue[1]){
                dispatch(setFilter('date', {startDate: newValue[0], endDate: newValue[1]}))
              }
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </Modal>
        <Modal show={showModal === 'options'} style={{top:55}} paperStyle={{padding:0}} onClose={() => setShowModal('')} ignoreRef={optionsRef}>
          <div style={{width:250, display:'flex', flexDirection:'column'}}>
            {dateOptions.map((option, index) => 
              <div 
                style={{width:'100%', cursor:'pointer', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', height:50, borderTop: index !== 0 ? '1px solid grey' : '', backgroundColor: isHover === option ? constants.colors.primaryColorButLighter : ''}}
                onMouseEnter={() => {setIsHover(option)}} 
                onMouseLeave={() => setIsHover('')}
                onClick={() => onSelectDateOption(option)}
              >
                {option}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </LocalizationProvider>
  );
}

export default DateRange;