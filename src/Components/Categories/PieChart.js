import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import {Pie} from 'react-chartjs-2';
import * as constants from '../../constants'
import { ACTUAL, PLANNED} from '../../constants'
import PieChartToggle from './PieChartToggle'

function PieChart(props) {
  const categories = useSelector(state => state.filters.type === "Expenses" ? state.expenseCategories : state.incomeCategories)
  const transactions = useSelector(state => state.filters.type === "Expenses" ? state.filteredExpenseTransactions : state.filteredIncomeTransactions)
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)
  const categoryChartType = useSelector(state => state.buttons.categoryChartType)

  var budgetMonths= (endDate.getFullYear() - startDate.getFullYear()) * 12;
  budgetMonths -= startDate.getMonth();
  budgetMonths += endDate.getMonth();
  budgetMonths++;

  function getPieChartData(){
    var pieLabels = [];
    var pieData = [];

    for(var i = 0; i < categories.length; i++){
      pieLabels.push(categories[i].CategoryName)
      if(categoryChartType == PLANNED){
        pieData.push(categories[i].Planned * budgetMonths)
      }else if(categoryChartType == ACTUAL){
        pieData.push(0)
        for(var x = 0; x < transactions.length; x++){
          if(transactions[x].CategoryId == categories[i].CategoryId){
            pieData[i] += transactions[x].Amount;
          }
        }
      }
    }

    var pieChartData = {
      labels: pieLabels,
      datasets: [
        {
          label: 'Categories',
          backgroundColor: constants.chartColors,
          data: pieData
        }
      ]
    }
    return pieChartData
  }

  var content = <div style={{height:'100%', width:'100%'}}>
                  <Pie
                    data={getPieChartData()}
                    options={{
                      animation:{duration:1000, easing:'easeInOutCubic'},
                      maintainAspectRatio:false,
                      legend:{
                        display:true,
                        position:'bottom'
                      },
                      tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var label = data.labels[tooltipItem.index]
                                var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                label += ': $' + Number(value).toFixed(2);
                                return label;
                            }
                        }
                      }
                    }}
                  />
                </div>

    if((categoryChartType === ACTUAL && transactions.length === 0))
        content = <div style={{height:'100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                    <h1>No Transactions Found </h1><br/>
                    <h1>For The Filters Applied</h1>
                  </div>
    if(categories.length === 0)
      content = <div style={{height:'100%', display:'flex', alignItems:'center'}}>
                    <h1>No Categories To Show</h1>
                  </div>

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
      <PieChartToggle/>
      {content}
    </div>
  );
}

export default PieChart;
