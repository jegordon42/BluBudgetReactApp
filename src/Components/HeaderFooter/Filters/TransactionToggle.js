import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as constants from '../../../constants'
import { setFilter } from '../../../Store/Actions'

const options = ['Expenses', 'Income']

function TransactionToggle(props) {
  const [isHover, setIsHover] = useState('')
  const [isButtonHover, setIsButtonHover] = useState(false)
  const activeOption = useSelector((state) => state.filters.type)
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
  } 
  const optionStyle = {
    color: 'white', 
    fontSize:22,
    width:110,
    textAlign:'center',
    borderRadius: '17px',
    zIndex:100,
    cursor:'pointer',
    marginTop:-2,
    marginBottom:-2,
    paddingLeft:10,
    paddingRight:10
  }
  const active = {
    backgroundColor: constants.colors.primaryColorButLighter,
    borderRadius: '17px',
    position:'absolute',
    width:110,
    height:33,
    transition:'margin-left 0.2s'
  }

  function getOptionStyle(option){
    var style = {...optionStyle};
    if(isHover === option)
      style['backgroundColor'] = constants.colors.primaryColorButDarker
    return style
  }

  function buttonContainerStyle(){
    var style = {...buttonContainer}
    if(isButtonHover && props.hoveredStyle)
      style = {...style, ...props.hoveredStyle}
    return style
  }

  return (
    <div 
      style={buttonContainerStyle()} 
      onClick={props.onClick}
      onMouseEnter={() => {setIsButtonHover(true)}} 
      onMouseLeave={() => setIsButtonHover(false)}
    >
        <div style={{...active, marginLeft:options.indexOf(activeOption) * 110}}></div>
        {options.map((option) => 
          <div 
            style={getOptionStyle(option)} 
            onMouseEnter={() => {if(options[activeOption] !== option){setIsHover(option)}}} 
            onMouseLeave={() => setIsHover('')}
            onClick={() => {dispatch(setFilter('type',option));setIsHover('')}}
          >
            {option}
          </div>
        )}
    </div>
  );
}

export default TransactionToggle;