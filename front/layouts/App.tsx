import React from 'react';
import {Routes,Route} from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(()=> import('@pages/Login'))
const SignUp = loadable(()=> import('@pages/SignUp'))

const App = () => {
  return (
    <div>
    <Routes>
        <Route path='/'element={<Login/>}/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/signup' element={<SignUp/>}/>  
    </Routes>
    </div>
  )
}

export default App
