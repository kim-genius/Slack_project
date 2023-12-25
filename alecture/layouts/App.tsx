import React from 'react';
import {Routes,Route} from 'react-router-dom';
import Login from '@pages/Login';
import SignUp from '@pages/SignUp';
const App = () => {
  return (
    <div>
    <Routes>
        <Route path='/'element='/login'/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/signup' element={<SignUp/>}/>  
    </Routes>
    </div>
  )
}

export default App
