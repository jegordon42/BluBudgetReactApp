const login = (result) => (
  {
    type: 'LOGIN',
    data: result
  }
);

const logout = () => (
  {
    type: 'LOGOUT'
  }
);

const saveTransaction = (transaction) => (
  {
    type: 'SAVE_TRANSACTION',
    data: {transaction}
  }
);

const addTransaction = (transaction) => {
  return {
    type: 'ADD_TRANSACTION',
    data: { transaction }
  }
}

const deleteTransaction = (transaction) => (
  {
    type: 'DELETE_TRANSACTION',
    data: {transaction}
  }
);

const selectCategory = (categoryId) => (
  {
    type: 'SELECT_CATEGORY',
    data: {categoryId}
  }
);

const saveCategory = (category, type) => (
  {
    type: 'SAVE_CATEGORY',
    data: {category, type}
  }
);

const addCategory = (category) => (
  {
    type: 'ADD_CATEGORY',
    data: {category}
  }
);

const deleteCategory = (categoryId, type) => (
  {
    type: 'DELETE_CATEGORY',
    data: {categoryId, type}
  }
);

const setFilter = (filter, value) => (
  {
    type: 'SET_FILTER',
    data: {filter, value}
  }
);

const setAutologinFlag = (value) => {
  return {
    type: 'SET_AUTOLOGIN_FLAG',
    data: { value }
  }
}

const showError = (message) => {
  return { 
    type: 'SHOW_ERROR',
    data: { message }
  }
}

const closeError = () => {
  return {
    type: 'CLOSE_ERROR'
  }
}

const selectButton = (buttonType, buttonValue) => {
  return {
    type: 'SELECT_BUTTON',
    data: {buttonType, buttonValue}
  }
}

const showSettings = () => {
  return {
    type: 'SHOW_SETTINGS'
  }
}

const closeSettings = () => {
  return {
    type: 'CLOSE_SETTINGS'
  }
}

const setDevice = (device) => {
  return {
    type: 'SET_DEVICE',
    data:{device}
  }
}

const isNewUser = (value) => {
  return {
    type: 'SET_ISNEWUSER',
    data:{value}
  }
}

export {showSettings, closeSettings, selectButton, login, logout, saveTransaction, addTransaction, deleteTransaction, selectCategory, saveCategory, addCategory, deleteCategory, setFilter, setAutologinFlag, showError, closeError,setDevice, isNewUser}
