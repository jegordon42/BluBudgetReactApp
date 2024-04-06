import React from 'react';
import { useSelector } from 'react-redux';
import AnimatedNumber from "animated-number-react";

function Metrics(props) {
  const expenseTransactions = useSelector(state => state.filteredExpenseTransactions)
  const incomeTransactions = useSelector(state => state.filteredIncomeTransactions)
  var formatValue = (value) => value.toFixed(2);

  function getTotalSpent(){
    var total = 0;
    for(var i = 0; i < expenseTransactions.length; i++){
      total += Number(expenseTransactions[i].Amount);
    }
    return total;
  }

  function getTotalIncome(){
    var total = 0;
    for(var i = 0; i < incomeTransactions.length; i++){
      total += Number(incomeTransactions[i].Amount);
    }
    return total;
  }


  return (
    <div style={row}>
        <div style={column}>
          <h4>$<AnimatedNumber value={getTotalIncome()} formatValue={formatValue} /></h4>
          <h6 style={{marginTop:-10}}>Income</h6>
        </div>
        <div style={column}>
          <h2>-</h2>
        </div>
        <div style={column}>
          <h4>$<AnimatedNumber value={getTotalSpent()} formatValue={formatValue} /></h4>
          <h6 style={{marginTop:-10}}>Expenses</h6>
        </div>
        <div style={column}>
          <h2>=</h2>
        </div>
        <div style={column}>
          <h4>$<AnimatedNumber value={getTotalIncome() - getTotalSpent()} formatValue={formatValue} /></h4>
          <h6 style={{marginTop:-10}}>Saved</h6>
        </div>
    </div>
  );
}

const row = {
  display:'flex', 
  flexDirection:'row', 
  justifyContent:'space-between',
  paddingRight:20,
  paddingLeft:20
}
const column = {
  display:'flex', 
  flexDirection:'column', 
  alignItems:'center'
}

export default Metrics;
