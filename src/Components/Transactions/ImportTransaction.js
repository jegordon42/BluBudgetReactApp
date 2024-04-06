import React, {useState} from 'react'
import '../../App.css'
import { Modal, Nav, Button, Form } from 'react-bootstrap'
import readXlsxFile from 'read-excel-file'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import DeleteIcon from '@mui/icons-material/Delete';
import * as constants from '../../constants'
const papa = require('papaparse');

function ImportTransaction(props) {
    const [rows, setRows] = useState(null)
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [importTransactions, setImportTransactions] = useState(null)
    const [gridKey, setGridKey] = useState(0)

    function onGridReady(params) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit()
    }
    
    function CategoryCellRenderer(params){
        return <Form.Control as="select" defaultValue={params.value} style={{width:'100%'}} onChange={(event)=>{params.setValue(event.target.value)}}>
                {props.categories.map((category) => 
                  <option key={category.CategoryId} value={category.CategoryId}>{category.CategoryName}</option>
                )}
              </Form.Control>
    }

    function DeleteCellRenderer(params){
        return <Button variant="danger" size="sm" onClick={()=>{var trans = importTransactions; trans.splice(params.rowIndex, 1); setImportTransactions(trans); setGridKey(gridKey + 1)}}><DeleteIcon/></Button>
    }

    function onCellValueChanged(event){
        var transactions = importTransactions;
        transactions[event.rowIndex] = event.data;
        setImportTransactions(transactions)
      }

    function readFile(){
        var fileToImport = document.getElementById('fileToImport')
        var importTrans = []
        papa.parse(fileToImport.files[0], {
            step: function(result) {
                if(isNaN(result.data[6]) == false && result.data[6] > 0){
                    var importResult = {TransactionId: 0, CategoryId: props.categories[0]['CategoryId'], CategoryName: result.data[4], Description: result.data[2], Amount : Number(result.data[6]), Date : result.data[0]}
                    importTrans.push(importResult)
                }
            },
            complete: function(results, file) {
                setImportTransactions(importTrans)
            }
        });
      }

    function handleClose(){
        setImportTransactions(null);
        props.setShowImport(false);
    }
    
    function handleImport(){
        alert('Not Implemented')
            return
        // fetch(constants.url + 'AddTransactions', {
        //     method : "POST",
        //     headers : {"Content-type" : "application/json"},
        //     body: JSON.stringify({
        //       userId : props.user['userId'],
        //       transactionType : props.TransactionType.replace('es', 'e'),
        //       transactionsToAdd : importTransactions
        //     })
        // })
        // .then(response => response.json())
        // .then(result => {
        //   var transactions = constants.adjustTransDates(result['transactions']);
        //   props.setTransactions(transactions)
        //   props.setFilteredTransactions(transactions, props.TransactionType.replace('es', 'e'))
        //   handleClose()
        // })
        // .catch(e => {
        //     console.log(e);
        // });
    }
    
    return (
    <Modal show={props.show} onHide={handleClose} dialogClassName="modalStyle">
        <Modal.Header>
            <Modal.Title>Import {props.TransactionType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <>
            <input id="fileToImport" type="file" onChange={readFile} style={{width:600, marginBottom:10}}/>

{importTransactions && (
    <div className="ag-theme-alpine" style={{ height: '100%', width:'100%' } }>
        <AgGridReact
            domLayout="autoHeight"
            rowData = {importTransactions}
            onCellValueChanged = {onCellValueChanged}
            onGridReady = {onGridReady}
            key = {gridKey}
        >
            <AgGridColumn headerName="Original Category" field="CategoryName" width={160}></AgGridColumn>
            <AgGridColumn headerName="Category" field="CategoryId" width={160} editable resizable cellRendererFramework={CategoryCellRenderer} ></AgGridColumn>
            <AgGridColumn headerName="Description" field="Description" minWidth={400} maxWidth={800} editable resizable></AgGridColumn>
            <AgGridColumn headerName="Amount" field="Amount" width={125} editable></AgGridColumn>
            <AgGridColumn headerName="Date" field="Date" width={125} editable></AgGridColumn>
            <AgGridColumn headerName="Delete" field="TransactionId" width={100} cellRendererFramework={DeleteCellRenderer}></AgGridColumn>
        </AgGridReact>
    </div>
)}
            </>
            
                 
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleImport}>Import</Button>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
}

export default ImportTransaction;