import * as constants from '../constants'
import { createStore } from 'redux';
import { STATE_CHANGED } from 'hammerjs';
import { WEEK, MONTH, YEAR, CUSTOM, EXPENSES, INCOME, ACTUAL, PLANNED, TOTAL, BYCATEGORY } from '../constants';

const defaultState = {
  firebaseUser: null,
  user: null,
  isNewUser:false,
  device:'desktop',
  selectedCategoryId: null,
  selectedTransaction: null,
  expenseCategories: [],
  incomeCategories: [],
  categoryDictionary: {},
  expenseTransactions: [],
  incomeTransactions: [],
  filters: Object.assign({}, constants.defaultFilters),
  filteredExpenseTransactions: [],
  filteredIncomeTransactions: [],
  autologinFlag : false,

  showSettings:false,
  showError:false,
  errorMessage:'',

  buttons:{
    totalOrByCategory : TOTAL,
    dateType : MONTH,
    categoryChartType : ACTUAL,
  }
};

const Reducer = (state = defaultState, action) => {
  state = Object.assign({}, state)
  switch (action.type) {
    case "LOGIN":
        state.firebaseUser = action.data.firebaseUser 
        var userObj = action.data.userObj
        state.user = userObj['user'];
        state.expenseCategories = userObj['expenseCategories'];
        state.incomeCategories = userObj['incomeCategories'];
        state.categoryDictionary = getCategoryDictionary(userObj['incomeCategories'], userObj['expenseCategories'])
        initCategoryFilters(state)

        state.expenseTransactions = userObj['expenseTransactions']
        state = constants.setFilteredTransactions("Expenses", state)

        state.incomeTransactions = userObj['incomeTransactions']
        state = constants.setFilteredTransactions("Income", state)
        
        return state
    case "LOGOUT":
          state = Object.assign({}, constants.defaultState)
          state.autologinFlag = true
          return state
    case "SAVE_TRANSACTION":
      var transactions = action.data.transaction.transactionType === 'Expenses' ? state.expenseTransactions : state.incomeTransactions
      for(var i = 0; i < transactions.length; i++){
        if(transactions[i]['TransactionId'] == action.data.transaction.TransactionId){
          transactions[i] = action.data.transaction
        }
      }
      state = constants.setFilteredTransactions(action.data.transaction.transactionType, state)
      state.activeModal = ''
      return state
    case "DELETE_TRANSACTION":
      var transactions = action.data.transaction.transactionType == 'Expenses' ? state.expenseTransactions : state.incomeTransactions
      for(var i = 0; i < transactions.length; i++){
        if(transactions[i]['TransactionId'] == action.data.transaction.TransactionId){
          transactions.splice(i, 1);
          break
        }
      }
      state = constants.setFilteredTransactions(action.data.transaction.transactionType, state)
      return state
    case 'ADD_TRANSACTION':
      var transType = action.data.transaction.transactionType
      delete action.data.transaction['transactionType']
      delete action.data.transaction['userId']
      if(transType === "Expense"){
        state.expenseTransactions.unshift(action.data.transaction)
        constants.setFilteredTransactions("Expenses", state)
      } else {
        state.incomeTransactions.unshift(action.data.transaction)
        constants.setFilteredTransactions("Income", state)
      }
      return state
    case "SAVE_CATEGORY":
      var categories = action.data.type == 'Expenses' ? state.expenseCategories : state.incomeCategories
      var newCategories = []
      for(var i = 0; i < categories.length; i++){
        if(categories[i]['CategoryId'] === action.data.category.CategoryId){
          newCategories.push(action.data.category)
        }
        else
          newCategories.push(categories[i])
      }
      if(action.data.type === 'Expenses')
        state.expenseCategories = newCategories
      else
        state.incomeCategories = newCategories
      state.categoryDictionary[action.data.category.CategoryId] = action.data.category
      return state
    case "DELETE_CATEGORY":
      var categories = action.data.type === 'Expenses' ? state.expenseCategories : state.incomeCategories
      for(var i = 0; i < categories.length; i++){
        if(categories[i]['CategoryId'] == action.data.categoryId)
          categories.splice(i, 1);
      }
      var newCategories = []
      categories.map((category) => newCategories.push({...category}))
      if(action.data.type === 'Expenses')
        state.expenseCategories = newCategories
      else
        state.incomeCategories = newCategories
      delete state.categoryDictionary[action.data.categoryId]
      var filters = state.filters.type === 'Expenses' ? state.filters.expenseCategories : state.filters.expenseCategories
      for(var i = 0; i < filters.length; i++){
        if(filters[i]['CategoryId'] === action.data.categoryId)
          filters.splice(i, 1);
      }
      return state
    case "ADD_CATEGORY":
      var categoryType = action.data.category.categoryType
      delete action.data.category['categoryType']
      state.categoryDictionary[action.data.category.CategoryId] = action.data.category
      var categories = categoryType === "Expense" ? state.expenseCategories : state.incomeCategories
      var newCategories = []
      categories.map((category) => newCategories.push({...category}))
      newCategories.unshift(action.data.category)
      if(categoryType === "Expense"){
        state.expenseCategories = newCategories
        state.filters.expenseCategories.unshift(action.data.category.CategoryId)
      } else {
        state.incomeCategories = newCategories
        state.filters.incomeCategories.unshift(action.data.category.CategoryId)
      }
      return state
    case "SELECT_BUTTON":
      state.buttons[action.data.buttonType] = action.data.buttonValue
      return state
    case "SET_FILTER":
        if(action.data.filter === "reset"){
          state.filters = Object.assign({}, constants.defaultFilters)
          initCategoryFilters(state)
        }
        else if(action.data.filter === "startDate")
          state.filters.startDate = action.data.value
        else if(action.data.filter === "endDate")
          state.filters.endDate = action.data.value
        else if(action.data.filter === "date"){
          state.filters.startDate = action.data.value.startDate
          state.filters.endDate = action.data.value.endDate
        }
        else if(action.data.filter === "type")
          state.filters.type = action.data.value
        else if(action.data.filter === "incomeCategories" || action.data.filter === "expenseCategories"){
          if(action.data.filter === "incomeCategories")
            state.filters.incomeCategories = action.data.value
          else
            state.filters.expenseCategories = action.data.value
        }
        else if(action.data.filter === "description"){
          if(action.data.value.comparator === "None")
            delete state.filters.description
          else
            state.filters['description'] = action.data.value
        }
        else if(action.data.filter === "amount"){
          if(action.data.value.comparator === "None")
            delete state.filters.amount
          else
            state.filters['amount'] = action.data.value
        }
        constants.setFilteredTransactions(state.filters.type, state)
        return state
    case 'SET_AUTOLOGIN_FLAG':
        state.autologinFlag = action.data.value
        return state
    case 'SHOW_ERROR':
        state.showError = true
        state.errorMessage = action.data.message
        return state
    case 'CLOSE_ERROR':
        state.showError = false
        return state
    case 'SHOW_SETTINGS':
        state.showSettings = true
        return state
    case 'CLOSE_SETTINGS':
        state.showSettings = false
        return state
    case 'SET_DEVICE':
      state.device = action.data.device
      return state
    case 'SET_ISNEWUSER':
      state.isNewUser = action.data.value
      return state
    default:
      return state
  }
};

function getCategoryDictionary(incomeCategories, expenseCategories, fi){
  var categoryDictionary = {}
  incomeCategories.forEach((category) => categoryDictionary[category.CategoryId] = category)
  expenseCategories.forEach((category) => categoryDictionary[category.CategoryId] = category)
  return categoryDictionary;
}

function initCategoryFilters(state){
  state.filters.incomeCategories = []
  state.filters.expenseCategories = []
  state.incomeCategories.forEach((category) => state.filters.incomeCategories.push(category.CategoryId))
  state.expenseCategories.forEach((category) => state.filters.expenseCategories.push(category.CategoryId))
}

let Store = createStore(Reducer)

export default Store;