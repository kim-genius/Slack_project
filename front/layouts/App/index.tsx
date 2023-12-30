import React from 'react';
import {Routes,Route} from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(()=> import('@pages/Login'))
const SignUp = loadable(()=> import('@pages/SignUp'))
const Channel = loadable(()=>import('@pages/Channel'))
const App = () => {
  return (
    <div>
    <Routes>
        <Route path='/'element={<Login/>}/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/signup' element={<SignUp/>}/>  
        <Route path="/workspace/channel" element={<Channel></Channel>}></Route>
    </Routes>
    </div>
  )
}

export default App
