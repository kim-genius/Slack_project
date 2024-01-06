import React from 'react';
import {Routes,Route} from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(()=> import('@pages/LogIn'))
const SignUp = loadable(()=> import('@pages/SignUp'))
const Workspace = loadable(()=> import('@layouts/Workspace'))
const Channel = loadable(()=>import('@pages/Channel'))
const DirectMessage = loadable(()=>import('@pages/DirectMessage'))

const App = () => {
  return (
    <div>
    <Routes>
        <Route path='/'element={<Login/>}/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/signup' element={<SignUp/>}/>  
        <Route path ='/workspace' element ={<Workspace/>}>
          <Route path="/workspace/:workspace/channel/:channel" element={<Channel></Channel>}></Route>
          <Route path="/workspace/:workspace/dm/:id" element={<DirectMessage></DirectMessage>}></Route>
        </Route>
    </Routes>
    </div>
  )
}

export default App
