import React from 'react';
import { useSelector } from 'react-redux';
import {Bar} from 'react-chartjs-2';
import * as chartData from './GetChartData'
import BarChartToggle from './BarChartToggle';

function BarChart(props) {
  const totalOrByCategory = useSelector(state => state.buttons.totalOrByCategory)
  const transactions = useSelector(state => state.filters.type === "Expenses" ? state.filteredExpenseTransactions : state.filteredIncomeTransactions)
  const categories = useSelector(state => state.filters.type === "Expenses" ? state.expenseCategories : state.incomeCategories)
  const filters = useSelector(state => state.filters)

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
      <BarChartToggle/>
      <div style={{height:'100%', width:'100%'}}>
        <Bar 
          data={chartData.getBarChartData(filters, transactions, categories, totalOrByCategory)}
          options={{
            maintainAspectRatio:false,
            legend:{
              display:true,
              position:'bottom'
            },
            scales: {
              yAxes: [{
                  ticks: {
                      min:0,
                      callback: function(value, index, values) {
                          return '$' + value;
                      }
                  }
              }]
            },
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      var label = data.datasets[tooltipItem.datasetIndex].label || '';
                      var value = tooltipItem.value;

                      label += ': $' + Number(value).toFixed(2);
                      return label;
                  }
              }
          }
          }}
        /> 
      </div>
    </div>
          
  );
}

export default BarChart;
