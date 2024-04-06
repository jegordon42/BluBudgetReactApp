import React from 'react';
import { useSelector } from 'react-redux';
import AnimatedNumber from "animated-number-react";

function Metrics(props) {
  const categories = useSelector(state => state.filters.type == 'Expenses' ? state.expenseCategories : state.incomeCategories)
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)

  var budgetMonths= (endDate.getFullYear() - startDate.getFullYear()) * 12;
  budgetMonths -= startDate.getMonth();
  budgetMonths += endDate.getMonth();
  budgetMonths++;

  var totalPlanned = 0
  var totalSpent = 0
  categories.forEach(category => {
    totalPlanned += category.Planned
    totalSpent += category.amountSpent
  });
  totalPlanned = totalPlanned * budgetMonths
  var formatValue = (value) => value.toFixed(2);

  return (
    <div style={row}>
        <div style={column}>
          <h4>$<AnimatedNumber value={totalPlanned} formatValue={formatValue} /></h4>
          <h6 style={{marginTop:-10}}>Planned</h6>
        </div>
        <div style={column}>
          <h2>-</h2>
        </div>
        <div style={column}>
          <h4>$<AnimatedNumber value={totalSpent} formatValue={formatValue} /></h4>
          <h6 style={{marginTop:-10}}>Actual</h6>
        </div>
        <div style={column}>
          <h2>=</h2>
        </div>
        <div style={column}>
          <h4>$<AnimatedNumber value={Math.abs(totalPlanned - totalSpent)} formatValue={formatValue} /></h4>
          <h6 style={{marginTop:-10}}>{totalPlanned > totalSpent ? "Remaining" : "Over"}</h6>
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
