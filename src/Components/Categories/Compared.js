import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { Chart, ChartTitle, ChartTooltip, ChartSeries, ChartSeriesItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';

function Compared(props) {
  const categories = useSelector(state => state.filters.type === "Expenses" ? state.expenseCategories : state.incomeCategories)
  const transactions = useSelector(state => state.filters.type === "Expenses" ? state.filteredExpenseTransactions : state.filteredIncomeTransactions)
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)

  function filteredDateRangeAdjustment(){
    var numDaysInFilteredRange = Math.ceil((Math.abs(endDate - startDate)) / (1000 * 60 * 60 * 24)) + 1;
    if([28, 29, 30, 31].includes(numDaysInFilteredRange)) 
      return 1;
    return numDaysInFilteredRange / (365 / 12) //Average month length
  }

  const tooltipRender = ({ point }) => {
    const { value } = point;

    return (
      <span>
        Planned: ${ value.target.toFixed(2) }
        <br />
        Actual: ${ value.current.toFixed(2) }
        <br />
        Diff: ${ (value.target - value.current).toFixed(2) }
      </span>
    )
  };

  function getActualAmount(categoryId){
    var total = 0;
    for(var i = 0; i < transactions.length; i++){
      if(transactions[i].CategoryId == categoryId){
        total += transactions[i].Amount;
      }
    }
    return total;
  }

  return (
    <div style={{overflow: 'scroll'}}>
      { categories.map((category) => {
        var actualAmount = getActualAmount(category.CategoryId);
        var planned = category.Planned * filteredDateRangeAdjustment()
        var max = actualAmount < planned ? planned * 2 : ((actualAmount / planned) + 1) * planned
        return (
          <Chart style={{ height: 80 }}>
            <ChartTitle text={category.CategoryName} align="left"/>
            <ChartSeries >
                <ChartSeriesItem type="bullet" color="#4361EE" data={[[actualAmount, planned]]} />
            </ChartSeries>
            <ChartValueAxis>
              <ChartValueAxisItem 
                majorGridLines={{ visible: false }} 
                minorTicks={{ visible: false }} 
                min={0} 
                max={max} 
                labels={{format: "${0}"}} 
                plotBands={[{from: 0, to: planned, color: 'lightgreen', opacity: .3}, {from: planned, to: max, color: '#FFC6FF', opacity: .2}]} 
              />
            </ChartValueAxis>
            <ChartTooltip render={tooltipRender} background="white"/>
          </Chart>)
        })}
    </div>
  );
}

export default Compared;
