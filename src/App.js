import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import "@progress/kendo-theme-bootstrap/dist/all.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Header from './Components/HeaderFooter/Header'
import MobileHeader from './Components/HeaderFooter/MobileHeader';
import Footer from './Components/HeaderFooter/Footer'
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ForgotPassword from './Components/ForgotPassword'
import GetApp from './Components/OtherPages/GetApp';
import Support from './Components/OtherPages/Support'
import About from './Components/OtherPages/About'
import Privacy from './Components/OtherPages/Privacy'
import Terms from './Components/OtherPages/Terms'
import SetUp from './Components/SetUp';
import TransactionsPage from './Components/Transactions/TransactionsPage'
import CategoriesPage from './Components/Categories/CategoriesPage';
import Error from './Components/Error'
import { initializeApp } from "firebase/app";
import { login, setAutologinFlag, setDevice } from './Store/Actions';
import { getAuth } from '@firebase/auth';
import * as constants from './constants';
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { LicenseInfo } from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(
  '',
);

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

function App() {
  const [autologinFailed, setAutologinFailed] = useState(false)
  const device = useSelector(state => state.device ? state.device : 'desktop')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  if(window.outerWidth <=768)
    dispatch(setDevice('mobile'))

  function handleWindowSizeChange() {
      if(window.outerWidth <=768)
        dispatch(setDevice('mobile'))
      else
        dispatch(setDevice('desktop'))
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  //AUTOLOGIN
  var unsubscribe = getAuth().onAuthStateChanged((user) => {
    if(autologinFailed)//This ensures autologin only happens on app start
      return
    setAutologinFailed(true)
    if(!user){ //If the user is logged in on this device
      dispatch(setAutologinFlag(true))
      if(['/dashboard', '/transactions', '/categories', '/setup'].includes(location.pathname))
          navigate('/login')
        else
          navigate(location)
      return
    }
    //If this is app start and the user is logged in on firebase, login through flask
    var token = user['stsTokenManager']['accessToken']
    var userId = user['uid']
    fetch(constants.url + 'Login', {
      method: "POST",
      headers: { 
        "Content-type": "application/json",
        "authorization" : token
      },
      body: JSON.stringify({
          userId : userId
      })
    })
    .then(response => response.json())
    .then(result => {
      if(result['message'] == 'Success'){
        result['firebaseUser'] = user
        dispatch(login(result))
        if(['/', '/login', '/signup'].includes(location.pathname))
          navigate('/transactions')
        else
          navigate(location)
      }
    })
    .catch((error) => {
      console.log(error)
    });
  })
  unsubscribe();

  function RequireAuth({children}) {
    let user = useSelector(state => state.user)
    if (!user)
      return (
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <CircularProgress/>
          Logging back in, this may take a minute or two
        </div> 
      )
    else
      return children;
  }

  function RequireDesktop({children}){
    if (device === 'mobile')
      return <GetApp/>
    else
      return children;
  }

  return (
    <div style={{backgroundColor:constants.colors.backgroundColor, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
      {device === 'desktop' && 
        <Header/>
      }
      {device === 'mobile' && 
        <MobileHeader/>
      }
      <Routes>
        <Route path="/" element={<RequireDesktop><Login/></RequireDesktop>} />
        <Route path="/login" element={<RequireDesktop><Login/></RequireDesktop>} />
        <Route path="/signup" element={<RequireDesktop><SignUp/></RequireDesktop>} />
        <Route path="/forgotPassword" element={<RequireDesktop><ForgotPassword/></RequireDesktop>} />
        <Route path="/getapp" element={<GetApp/>} />
        <Route path="/support" element={<Support/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/terms" element={<Terms/>} />
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/setup" element={<RequireAuth><SetUp /></RequireAuth>}/>
        <Route path="/transactions" element={<RequireAuth><TransactionsPage /></RequireAuth>}/>
        <Route path="/categories" element={<RequireAuth><CategoriesPage /></RequireAuth>}/>
      </Routes>
      <Footer/>
      <Error/>
    </div>
  );
}

export default App;
