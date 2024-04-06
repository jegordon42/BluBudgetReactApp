import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, saveCategory, deleteCategory } from '../../Store/Actions';
import Button from '../Common/Button';
import CustomFetch from '../../CustomFetch'
import { DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { renderProgress } from './RenderProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import * as constants from '../../constants'
import Stack from '@mui/material/Stack';

function CategoriesGrid(props) {
  const type = useSelector(state => state.filters.type)
  const counter = useSelector(state => state.filters.counter)
  const categories = useSelector(state => (counter > 1 && type === "Expenses") ? state.expenseCategories : state.incomeCategories)
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)
  const dispatch = useDispatch()

  var budgetMonths= (endDate.getFullYear() - startDate.getFullYear()) * 12;
  budgetMonths -= startDate.getMonth();
  budgetMonths += endDate.getMonth();
  budgetMonths++;

  var categoryList = []
  categories.map((category) => {
    var cat = Object.assign({}, category)
    cat['Planned'] = cat['Planned'] * budgetMonths
    categoryList.push({
      ...cat, 
      id:category.CategoryId, 
      PercentSpent: [cat.Planned, category.amountSpent].includes(0) ? 0 : category.amountSpent / cat.Planned
    })
  })

  function addCategoryClick(){
    var newCategory = {
        'CategoryName' : '',
        'Planned' : 0,
        'categoryType' : type.replace('es', 'e'),
        'amountSpent' : 0
    }
    CustomFetch('AddCategory', {category: newCategory})
    .then(result => {
        if(result['message'] === 'Success'){
            newCategory['CategoryId'] = result['categoryId']
            dispatch(addCategory(newCategory))
        } else {
            console.log('Error Adding Category')
        }   
    })
    .catch(e => {
        console.log(e);
    });
  }

  function deleteCategoryClick(categoryId){
    CustomFetch('DeleteCategory', {categoryId})
    .then(result => {
        if(result['message'] === 'Success'){
            dispatch(deleteCategory(categoryId, type))
        } else {
            console.log('Error Deleting Category')
        }   
    })
    .catch(e => { 
        console.log(e);
    });
  }

  function onUpdateValue(params){
    if(!params.row)
      return

    params.row[params.field] = params.value

    var updatedCategory = {
        'CategoryId' : params.row.CategoryId,
        'CategoryName' : params.row.CategoryName,
        'Planned' : params.row.Planned,
        'amountSpent' : params.row.amountSpent
    }

    CustomFetch('UpdateCategory', {category: updatedCategory})
    .then(result => {
        if(result['message'] === 'Success'){
            dispatch(saveCategory(updatedCategory, type))
        } else {
            console.log('Error Updating Category')
        }    
    })
    .catch(e => {
        console.log(e);
    });
  }
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const columns = [
    {field: 'CategoryName', headerName: 'Category', width: 150, type: 'string', disableColumnMenu:true, editable: true},
    {field: 'Planned',      headerName: 'Budget',  width: 110, type: 'number', disableColumnMenu:true, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(Number(value))},
    {field: 'amountSpent', headerName: 'Actual', width: 110, type: 'number', disableColumnMenu:true, valueFormatter: ({ value }) => currencyFormatter.format(Number(value))},
    {field: 'PercentSpent', headerName: '% Spent', width: 225, type: 'number', disableColumnMenu:true, renderCell: renderProgress},
    {field: 'Delete', type: 'actions', headerName: 'Delete', width: 75, sortable:false, getActions: (params) => [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => {deleteCategoryClick(params.id)}}/>]}
  ];
  
  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
          <><h1>You have no categories,</h1><h1>create some to get started!</h1></>
      </Stack>
    );
  }

  return (
    <div style={catStyle}>
      <div style={catHeader}>
        <div style={{flex:1}}><h5 style={{margin:0}}>{type.replace('es', 'e')} Categories</h5></div>
        <div style={{flex:1, fontSize:13}}>Showing Budget For {budgetMonths} Month{budgetMonths === 1 ? '' : 's'}</div>
        <div style={{flex:1, marginTop:-6}}>
          <Button label="Add Category" style={{float:'right'}} fontSize={17} onClick={addCategoryClick} />
        </div>
      </div>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGridPro 
            disableSelectionOnClick
            rows={categoryList} 
            components={{NoRowsOverlay}}
            columns={columns} 
            onCellEditCommit={onUpdateValue}
          />
        </div>
      </div>
    </div>
  );
}

const catStyle = {
  display:'flex',
  flexDirection:'column',
  height:'100%'
}
const catHeader = {
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'flex-end',
  paddingLeft:20,
  paddingRight:10,
  paddingBottom:10
}

export default CategoriesGrid;
