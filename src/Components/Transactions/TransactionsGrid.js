import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTransaction, deleteTransaction, saveTransaction, showError } from '../../Store/Actions';
import Button from '../Common/Button';
import ImportTransaction from './ImportTransaction'
import CustomFetch from '../../CustomFetch'
import { DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/Delete';
import * as constants from '../../constants'
import Stack from '@mui/material/Stack';

function TransactionsGrid(props) {
  const transType = useSelector(state => state.filters.type)
  const noTransactions = useSelector(state => transType === 'Expenses' ? state.expenseTransactions.length === 0 : state.incomeTransactions.length === 0)
  const transactions = useSelector(state => transType === 'Expenses' ? state.filteredExpenseTransactions : state.filteredIncomeTransactions) 
  const categories = useSelector(state => transType === 'Expenses' ? state.expenseCategories : state.incomeCategories)
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)
  const categoryDict = useSelector(state => state.categoryDictionary)
  const [showImport, setShowImport] = useState(false);
  const dispatch = useDispatch()

  function getCategoryId(categoryName){
    for(var i = 0; i < categories.length; i++){
      var category = categories[i]
      if(category.CategoryName === categoryName)
        return category.CategoryId
    }
  }

  function onUpdateValue(params){
    if(!params.row)
      return

    if(params.field === 'CategoryId') 
      params.row.CategoryId = getCategoryId(params.value) 
    else if(params.field === 'Date')
      params.row.Date = constants.formatDate(params.value)
    else
      params.row[params.field] = params.value

    var updatedTransaction = {
      TransactionId : params.row.TransactionId,
      transactionType: transType.replace('es', 'e'),
      Description : params.row.Description,
      CategoryId : params.row.CategoryId,
      Amount : params.row.Amount,
      Date: params.row.Date
    }
    CustomFetch('UpdateTransaction', {transaction: updatedTransaction})
    .then(result => {
        if(result['message'] === 'Success'){
          updatedTransaction.transactionType = transType
          dispatch(saveTransaction(updatedTransaction))
        } else {
            console.log('Error Updating Transaction')
        }   
    })
    .catch(e => {
        console.log(e);
    });
  }

  function addTransactionClick(){
    if(categories.length ==0){
      dispatch(showError("Please add some categories before adding a transaction."))
      props.forceRerender()
      return;
    }
    var newDate = new Date()
    if(newDate < startDate || newDate > endDate)
      newDate = endDate
    var transaction = {
        transactionType: transType.replace('es', 'e'),
        Description : '',
        CategoryId : categories[0].CategoryId,
        Amount : 0,
        Date: constants.formatDate(newDate)
    }
    CustomFetch('AddTransaction', transaction)
    .then(result => {
        if(result['message'] === 'Success'){
            transaction['TransactionId'] = result['transactionId']
            dispatch(addTransaction(transaction))
        } else {
            console.log('Error Adding Transaction')
        }   
    })
    .catch(e => {
        console.log(e);
    });
  }

  function deleteTransactionClick(transactionId){
    CustomFetch('DeleteTransaction', {transactionId})
    .then(result => {
        if(result['message'] === 'Success')
          dispatch(deleteTransaction({TransactionId: transactionId, transactionType: transType}))
        else 
          console.log('Error Deleting Category') 
    })
    .catch(e => {
        console.log(e);
    });
  }
var categoryList = []
categories.map((category) => categoryList.push(category.CategoryName))

  function handleImportClick(){
    if(categories.length == 0){
      dispatch(showError("Please add some categories before attempting to import."))
      props.forceRerender()
      return;
    }
    setShowImport(true)
  }
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const common = {
    disableColumnMenu:true, 
    editable: true,
  }
  
  const columns = [
    { ...common, field: 'CategoryId', headerName: 'Category' , width: 150, type: 'singleSelect', valueOptions: categoryList, valueGetter: ({ value }) => categoryDict[value].CategoryName, valueSetter: (params) => {params.field = 'CategoryId'; onUpdateValue(params); return params.row }},
    { ...common, field: 'Description', headerName: 'Description', width: 220, type: 'string' },
    { ...common, field: 'Amount', headerName: 'Amount', width: 110, type: 'number', valueFormatter: ({ value }) => currencyFormatter.format(Number(value))},
    { ...common, field: 'Date', headerName: 'Date', width: 140, type: 'date', valueSetter: (params) => {params.field = 'Date';onUpdateValue(params); return params.row }},
    { field: 'Delete', type: 'actions', headerName: 'Delete', width: 75, sortable:false, getActions: (params) => [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => {deleteTransactionClick(params.id)}}/>]}
  ];

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        {categories.length === 0 &&
          <><h1>You have no categories,</h1><h1>create some to get started!</h1></>
        }
        {categories.length > 0 && noTransactions && 
          <><h1>You have no transactions,</h1><h1>create some to get started!</h1></>
        }
        {!noTransactions > 0  && transactions.length === 0 &&
          <>
            <h1>There are no transactions</h1><h1>for the filters specified</h1>
            <br/>
            <h1>Modify the filters or </h1><h1>create some more transactions!</h1>
          </>
        }
      </Stack>
    );
  }
  

  return (
    <div style={transStyle}>
      <div style={transHeader}>
        <div style={{flex:1}}><h5>{transType.replace('es', 'e')} Transactions</h5></div>
        
        <div style={{flex:1, marginTop:-6}}>
          <Button label="Add Transaction" style={{float:'right'}} fontSize={17} onClick={addTransactionClick} />
          {/* <Button label="Import" style={{float:'right', marginRight:5}} fontSize={17} onClick={handleImportClick} /> */}
        </div>
      </div>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGridPro 
            disableSelectionOnClick
            components={{NoRowsOverlay}}
            rows={transactions} 
            columns={columns} 
            onCellEditCommit={onUpdateValue}
          />
        </div>
      </div>
      <ImportTransaction 
        show={showImport} setShowImport={setShowImport} 
        user={props.user} 
        setTransactions={props.setTransactions} 
        setFilteredTransactions={props.setFilteredTransactions} 
        TransactionType={transType} 
        categories={categories} 
      />
    </div>
  );
}

const transStyle = {
  display:'flex',
  flexDirection:'column',
  height:'100%'
}
const transHeader = {
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  paddingLeft:20,
  paddingRight:10
}

export default TransactionsGrid;
