import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../../../Store/Actions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputBase from'@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

function OtherFilters(props) {
  const categoryType = useSelector((state) => state.filters.type)
  const categories = useSelector((state) => categoryType === 'Expenses' ? state.expenseCategories : state.incomeCategories)
  const selectedCategories = useSelector(state => categoryType === 'Expenses' ? state.filters.expenseCategories : state.filters.incomeCategories)

  const descriptionComparator =  useSelector((state) => 'description' in state.filters ? state.filters.description.comparator : 'None')
  const descriptionFilter = useSelector((state) => 'description' in state.filters ? state.filters.description.value : '')

  const amountComparator = useSelector((state) => 'amount' in state.filters ? state.filters.amount.comparator : 'None')
  const amountFilter = useSelector((state) => 'amount' in state.filters ? (amountComparator === 'In Range' ? state.filters.amount.value.valueFrom : state.filters.amount.value) : '')
  const amountFilterTo = useSelector((state) => 'amount' in state.filters ? (amountComparator === 'In Range' ? state.filters.amount.value.valueTo : '') : '')

  const handleClose = (event, reason) => { props.setShowModal('');};
  const dispatch = useDispatch()

  function handleDescriptionChange(type, value){
    var description = {}
    description[type] = value
    if(type === 'comparator')
      description['value'] = descriptionFilter
    else
      description['comparator'] = descriptionComparator
    
      dispatch(setFilter('description', description))
  }

  function handleAmountChange(type, value){
    var amount = {}
    
    if(type === 'comparator' && value !== 'In Range')
      amount = {'comparator': value, 'value' : amountFilter} 
    else if(type === 'comparator' && value === 'In Range')
      amount = {'comparator': value, 'value' : {valueFrom : amountFilter, valueTo : amountFilterTo}}
    else if(type === 'value' && amountComparator !== 'In Range')
      amount = {'comparator': amountComparator, 'value' : value}
    else if(type === 'value' && amountComparator === 'In Range')
      amount = {'comparator': amountComparator, 'value' : {valueFrom : value, valueTo : amountFilterTo}}
    else
      amount = {'comparator': amountComparator, 'value' : {valueFrom : amountFilter, valueTo : value}}
    
    dispatch(setFilter('amount', amount))
  }
  
  return (
    <Dialog disableEscapeKeyDown open={props.showModal === 'filters'} onClose={handleClose}>
        <DialogTitle style={{fontSize:25, textAlign:'center'}}>Filters</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection:'column'}}>
              <h6>Categories</h6>
              <Select
                style={{width:500}}
                value={selectedCategories.length > 0 ? selectedCategories : [0]}
                multiple
                onChange={(event) => dispatch(setFilter(categoryType === 'Expenses' ? 'expenseCategories' : 'incomeCategories', event.target.value))}
                input={<BootstrapInput />}
                renderValue={(selected) => {
                  var selCount = selected.length
                  if(selected[0] === 0)
                    selCount--;
                  if(selCount === 0 )
                    return 'No Categories Selected'
                  else if(selCount === categories.length)
                    return 'All Categories Selected'
                  else
                    return selCount + ' Categories Selected'
                }}
              >
                {categories.map((category) => (
                  <MenuItem value={category.CategoryId}>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                      <Checkbox checked={selectedCategories.includes(category.CategoryId)} />
                      <div>
                        {category.CategoryName}
                      </div>
                    </div>
                    
                  </MenuItem>
                ))}
              </Select>

              <h6 style={{marginTop:20}}>Description</h6>
              <div style={{display:'flex', flexDirection:'row'}}>
                <Select
                  style={{width:180}}
                  value={descriptionComparator}
                  onChange={(event) => handleDescriptionChange('comparator', event.target.value)}
                  input={<BootstrapInput/>}
                >
                    <MenuItem value={'None'}>None</MenuItem>
                    <MenuItem value={'Equals'}>Equals</MenuItem>
                    <MenuItem value={'Not Equal To'}>Not Equal To</MenuItem>
                    <MenuItem value={'Contains'}>Contains</MenuItem>
                    <MenuItem value={'Does Not Contain'}>Does Not Contain</MenuItem>
                    <MenuItem value={'Starts With'}>Starts With</MenuItem>
                    <MenuItem value={'Ends With'}>Ends With</MenuItem>
                </Select>
                <BootstrapInput style={{marginLeft:20, width:300}} placeholder='Enter a Description'  value={descriptionFilter} onChange={(event)=> handleDescriptionChange('value', event.target.value)}/>
              </div>

              <h6 style={{marginTop:20}}>Amount</h6>
              <div style={{display:'flex', flexDirection:'row'}}>
                <Select
                  style={{width:180}}
                  value={amountComparator}
                  onChange={(event) => handleAmountChange('comparator', event.target.value)}
                  input={<BootstrapInput/>}
                >
                    <MenuItem value={'None'}>None</MenuItem>
                    <MenuItem value={'Equals'}>Equals</MenuItem>
                    <MenuItem value={'Not Equal To'}>Not Equal To</MenuItem>
                    <MenuItem value={'Less Than'}>Less Than</MenuItem>
                    <MenuItem value={'Less Than Or Equal To'}>Less Than Or Equal To</MenuItem>
                    <MenuItem value={'Greater Than'}>Greater Than</MenuItem>
                    <MenuItem value={'Greater Than Or Equal To'}>Greater Than Or Equal To</MenuItem>
                    <MenuItem value={'In Range'}>In Range</MenuItem>
                </Select>
                <BootstrapInput style={{marginLeft:20, width:amountComparator === 'In Range' ? 135 : 300}} placeholder={amountComparator === 'In Range' ? 'From' : 'Enter An Amount'} type="number" value={amountFilter} onChange={(event)=> handleAmountChange('value', event.target.value)}/>
                {amountComparator === 'In Range' && 
                  <>
                    <div style={{marginLeft:10, marginRight:10}}>_</div>
                    <BootstrapInput style={{width:135}} placeholder="To" value={amountFilterTo} type="number" onChange={(event)=> handleAmountChange('value2', event.target.value)}/>
                  </>
                  
                }
                
              </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
  );
}

export default OtherFilters;