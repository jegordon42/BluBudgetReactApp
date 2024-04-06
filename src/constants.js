export const url = "https://budgetflaskapp.azurewebsites.net/"
export const chartColors = ['#33b1ff', '#8a3ffc', '#007d79', '#ff7eb6', '#fa4d56', '#6fdc8c', '#d12771', '#d2a106', '#bae6ff', '#ba4e00', '#d4bbff'];
export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
export const colors = {
  primaryColor: '#1DA1F2',
  primaryColorButLighter: '#b7e1fb',
  primaryColorButDarker: '#1471a9',
  accentColor: '#ff6f00',
  backgroundColor: '#ebebeb'
};

export const ACTUAL = 0;
export const PLANNED = 1;
export const COMPARED = 2;
export const WEEK = 0;
export const MONTH = 1;
export const YEAR = 2;
export const CUSTOM = 3;
export const TOTAL = 0;
export const BYCATEGORY = 1;

export const defaultState = {
  firebaseUser: null,
  user: null,
  activeTab:'',
  activeModal: '',
  expenseCategories: [],
  incomeCategories: [],
  categoryDictionary: {},
  expenseTransactions: [],
  incomeTransactions: [],
  filters: {
    type:'Expenses',
    startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
    endDate: new Date(),
    incomeCategories: [],
    expenseCategories:[],
    counter:1
  },
  filteredExpenseTransactions: [],
  filteredIncomeTransactions: [],
  autologinFlag : true,

  buttons:{
    totalOrByCategory : TOTAL,
    dateType : MONTH,
    categoryChartType : ACTUAL,
  }
};

export const defaultFilters = {
  type:'Expenses',
  startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
  endDate: new Date(),
  incomeCategories: [],
  expenseCategories:[],
  counter:1
}

export const setFilteredTransactions = (transType, state) => {
  var transactions = transType === "Expenses" ? state.expenseTransactions : state.incomeTransactions
  var trans = []
  var filterCategories = transType === "Expenses" ? state.filters.expenseCategories : state.filters.incomeCategories
  var filterAmount = state.filters.amount
  var filterDesc = state.filters.description
  state = initCategories(transType, state)

  for(var i = 0; i < transactions.length; i++){
    var transaction = transactions[i];
    var transDate = new Date(transaction['Date'])
    
    if(state.filters.startDate <= transDate && state.filters.endDate >= transDate){
      if(filterAmount){
        var comparator = filterAmount.comparator
        if(comparator === 'Equals' && Number(filterAmount.value) !== transaction['Amount'])
          continue
        if(comparator === 'Not Equal To' && Number(filterAmount.value) === transaction['Amount'])
          continue
        if(comparator === 'Less Than' && filterAmount.value <= transaction['Amount'])
          continue
        if(comparator === 'Less Than Or Equal To' && filterAmount.value < transaction['Amount'])
          continue
        if(comparator === 'Greater Than' && filterAmount.value >= transaction['Amount'])
          continue
        if(comparator === 'Greater Than Or Equal To' && filterAmount.value > transaction['Amount'])
          continue
        if(comparator === 'In Range' && (filterAmount.value.valueFrom > transaction['Amount'] || filterAmount.value.valueTo < transaction['Amount']))
          continue
      }
      if(filterDesc){
        var comparator = filterDesc.comparator
        if(comparator === 'Equals' && filterDesc.value.toLowerCase() != transaction['Description'].toLowerCase())
          continue
        if(comparator === 'Not Equal To' && filterDesc.value.toLowerCase() == transaction['Description'].toLowerCase())
          continue
        if(comparator === 'Contains' && !transaction['Description'].toLowerCase().includes(filterDesc.value.toLowerCase()))
          continue
        if(comparator === 'Does Not Contain' && transaction['Description'].toLowerCase().includes(filterDesc.value.toLowerCase()))
          continue
        if(comparator === 'Starts With' && !transaction['Description'].toLowerCase().startsWith(filterDesc.value.toLowerCase()))
          continue
        if(comparator === 'Ends With' && !transaction['Description'].toLowerCase().endsWith(filterDesc.value.toLowerCase()))
          continue
      }
      state.categoryDictionary[transaction['CategoryId']]['amountSpent'] += transaction['Amount']
      if(!filterCategories.includes(transaction['CategoryId']))
        continue
      trans.push({...transaction, id: transaction['TransactionId']})
    }
  }

  trans.sort((a, b) => (new Date(a['Date']) < new Date(b['Date'])) ? 1 : -1)

  if(transType === "Expenses")
    state.filteredExpenseTransactions = trans
  else
    state.filteredIncomeTransactions = trans

  state.filters.counter++
  return state
}

function initCategories(transType, state){
  var categories = transType === "Expenses" ? state.expenseCategories : state.incomeCategories
  for(var i = 0; i < categories.length; i++)
    state.categoryDictionary[categories[i]['CategoryId']]['amountSpent'] = 0
  return state
}


export const formatDate = (date) => {
  var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
  var month = date.getMonth() + 1
  month = month >= 10 ? month : '0' + month
  var year = date.getFullYear()
  return month + '/' + day + '/' + year
}