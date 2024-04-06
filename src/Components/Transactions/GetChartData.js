import * as constants from '../../constants'
const TOTAL = 0
const BYCATEGORY = 1

function formatDate(date){
  var month = date.getMonth() + 1
  if(month < 10)
    month = "0" + month
  var day = date.getDate()
  if(day < 10)
    day = "0" + day
  var year = date.getFullYear()
  return month + '/' + day + '/' + year
}

function getBarChartDataByDay(startDate, endDate, transactions, categories, type){
  var labels = []
  var actualData = []
  var datasets = []
  if(type === TOTAL){
    for(var curDate = startDate; curDate <= endDate; curDate.setDate(curDate.getDate() + 1)){
      labels.push(formatDate(curDate))
      actualData.push(0)
    }

    for(var i = 0; i < transactions.length; i++){
      var curDate = transactions[i]['Date']
      var index = labels.indexOf(curDate)
      if(index != -1)
        actualData[index] += Number(transactions[i]['Amount'])
    }
    datasets.push({
      label: 'Total',
      data: actualData,
      stack: '1',
      backgroundColor: constants.colors.primaryColor,
      borderWidth:0
    })
  }else if (type === BYCATEGORY){
    var categoryIds = []
    for(var i = 0; i < categories.length; i++){
      categoryIds.push(categories[i]['CategoryId'])
      actualData.push([])
    }
    for(var curDate = startDate; curDate <= endDate; curDate.setDate(curDate.getDate() + 1)){
      labels.push(formatDate(curDate))
      for(var i = 0; i < categories.length; i++){
        actualData[i].push(0)
      }
    }
    for(var i = 0; i < transactions.length; i++){
      var curDate = transactions[i]['Date']
      var labelIndex = labels.indexOf(curDate)
      if(labelIndex != -1){
        var categoryIndex = categoryIds.indexOf(Number(transactions[i]['CategoryId']))
        actualData[categoryIndex][labelIndex] += Number(transactions[i]['Amount'])
      }
    }
    for(var i = 0; i < categories.length; i++){
      datasets.push({
        label : categories[i]['CategoryName'],
        stack:'1',
        data : actualData[i],
        backgroundColor : constants.chartColors[i],
        borderWidth : 0
      });
    }
  }
  return {
    labels: labels,
    datasets: datasets
  }
}

function getBarChartDataByWeek(startDate, endDate, transactions, categories, type){
  var labels = []
  var dateRanges = []
  var actualData = []
  var datasets = []
  if(type === TOTAL){
    for(var curDate = startDate; curDate <= endDate;){
      var nextDate =  new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 6)
      if(nextDate > endDate)
        nextDate = endDate;
      labels.push((curDate.getMonth() + 1).toString() + "/" + curDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "/" + nextDate.getDate().toString())
      dateRanges.push([curDate, nextDate])
      actualData.push(0)
      curDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 7);
    }
    for(var i = 0; i < transactions.length; i++){
      var curDate = new Date(transactions[i]['Date'])
      for(var index = 0; index < dateRanges.length; index++){
        if(curDate >= dateRanges[index][0] && curDate <= dateRanges[index][1]){
          actualData[index] += Number(transactions[i]['Amount']);
          break;
        }
      }
    }
    datasets.push({
      label: 'Total',
      data: actualData,
      stack: '1',
      backgroundColor: constants.colors.primaryColor,
      borderWidth:0
    })
  }else if (type === BYCATEGORY){
    var categoryIds = []
    for(var i = 0; i < categories.length; i++){
      categoryIds.push(categories[i]['CategoryId'])
      actualData.push([])
    }
    for(var curDate = startDate; curDate <= endDate;){
      var nextDate =  new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 6)
      if(nextDate > endDate)
        nextDate = endDate;
      labels.push((curDate.getMonth() + 1).toString() + "/" + curDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "/" + nextDate.getDate().toString())
      dateRanges.push([curDate, nextDate])
      for(var i = 0; i < categories.length; i++){
        actualData[i].push(0)
      }
      curDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 7);
    }
    for(var i = 0; i < transactions.length; i++){
      var curDate = new Date(transactions[i]['Date'])
      for(var index = 0; index < dateRanges.length; index++){
        if(curDate >= dateRanges[index][0] && curDate <= dateRanges[index][1]){
          var categoryIndex = categoryIds.indexOf(Number(transactions[i]['CategoryId']))
          actualData[categoryIndex][index] += Number(transactions[i]['Amount'])
          break;
        }
      }
    }
    for(var i = 0; i < categories.length; i++){
      datasets.push({
        label : categories[i]['CategoryName'],
        stack:'1',
        data : actualData[i],
        backgroundColor : constants.chartColors[i],
        borderWidth : 0
      });
    }
  }
  return {
    labels: labels,
    datasets: datasets
  }
}

function getBarChartDataByMonth(startDate, endDate, transactions, categories, type){
  var labels = []
  var dateRanges = []
  var actualData = []
  var datasets = []
  if(type === TOTAL){
    for(var curDate = startDate; curDate <= endDate;){
      var nextDate =  new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1)
      nextDate.setDate(nextDate.getDate() - 1)

      var isLastDate = false;
      if(nextDate > endDate){
        nextDate = endDate;
        isLastDate = true
      }
      
      if(curDate.getDate() == 1 && !isLastDate)
        labels.push(constants.monthNames[curDate.getMonth()])
      else
        labels.push((curDate.getMonth() + 1).toString() + "/" + curDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "/" + nextDate.getDate().toString())
      
      dateRanges.push([curDate, nextDate])
      actualData.push(0)
      curDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1)
    }
    for(var i = 0; i < transactions.length; i++){
      var curDate = new Date(transactions[i]['Date'])
      for(var index = 0; index < dateRanges.length; index++){

        if(curDate >= dateRanges[index][0] && curDate <= dateRanges[index][1]){
          actualData[index] += Number(transactions[i]['Amount']);
          break;
        }
      }
    }
    datasets.push({
      label: 'Total',
      data: actualData,
      stack: '1',
      backgroundColor: constants.colors.primaryColor,
      borderWidth:0
    })
  }else if (type === BYCATEGORY){
    var categoryIds = []
    for(var i = 0; i < categories.length; i++){
      categoryIds.push(categories[i]['CategoryId'])
      actualData.push([])
    }
    for(var curDate = startDate; curDate <= endDate;){
      var nextDate =  new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1)
      nextDate.setDate(nextDate.getDate() - 1)
      var isLastDate = false;
      if(nextDate > endDate){
        nextDate = endDate;
        isLastDate = true
      }
      if(curDate.getDate() == 1 && !isLastDate)
        labels.push(constants.monthNames[curDate.getMonth()])
      else
        labels.push((curDate.getMonth() + 1).toString() + "/" + curDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "/" + nextDate.getDate().toString())
      dateRanges.push([curDate, nextDate])
      for(var i = 0; i < categories.length; i++){
        actualData[i].push(0)
      }
      curDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1)
    }
    for(var i = 0; i < transactions.length; i++){
      var curDate = new Date(transactions[i]['Date'])
      for(var index = 0; index < dateRanges.length; index++){
        if(curDate >= dateRanges[index][0] && curDate <= dateRanges[index][1]){
          var categoryIndex = categoryIds.indexOf(Number(transactions[i]['CategoryId']))
          actualData[categoryIndex][index] += Number(transactions[i]['Amount'])
          break;
        }
      }
    }
    for(var i = 0; i < categories.length; i++){
      datasets.push({
        label : categories[i]['CategoryName'],
        stack:'1',
        data : actualData[i],
        backgroundColor : constants.chartColors[i],
        borderWidth : 0
      });
    }
  }
  return {
    labels: labels,
    datasets: datasets
  }
}

export function getBarChartData(filters, transactions, categories, type){
  var startDate = new Date(filters.startDate.getFullYear(), filters.startDate.getMonth(), filters.startDate.getDate())
  var endDate = new Date(filters.endDate.getFullYear(), filters.endDate.getMonth(), filters.endDate.getDate())
  var numDaysInFilteredRange = Math.ceil((Math.abs(endDate - startDate)) / (1000 * 60 * 60 * 24)) + 1;
  if(numDaysInFilteredRange < 42)//6 weeks or lower
    return getBarChartDataByDay(startDate, endDate, transactions, categories, type)
  if(numDaysInFilteredRange < 168)//6 months and lower
    return getBarChartDataByWeek(startDate, endDate, transactions, categories, type)
  return getBarChartDataByMonth(startDate, endDate, transactions, categories, type)//6 months and higher
}
