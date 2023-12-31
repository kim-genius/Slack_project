import React, { useState,FC ,useCallback} from 'react'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import axios from 'axios'
import {LogOutButton, Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, WorkspaceWrapper,Workspaces,ProfileModal } from '@layouts/Workspace/styles'
import gravatar from 'gravatar'
import { Outlet, Route,Routes ,useNavigate} from 'react-router'
import loadable from '@loadable/component'
import Menu from '@components/Menu'



const Workspace : FC<React.PropsWithChildren<{}>>= ({children}) => {
  const navigate = useNavigate()
  const [showUserMenu,setShowUserMenu] =useState(false)
    const {data,error,mutate} =  useSWR('http://localhost:3095/api/users',fetcher)

    const onLogout = useCallback(()=>{ 
            axios.post('http://localhost:3095/api/users/logout',null,{
                withCredentials:true,
            })
            .then(()=>{mutate()})

    },[])
  const onClickUserProfile = useCallback(()=>{setShowUserMenu((prev)=>!prev)},[])

  if(!data){
    navigate('/login')

  }
  return (
    <div> 
        <Header>
        {data &&  <RightMenu>
                <span onClick={onClickUserProfile}>
             <ProfileImg src={gravatar.url(data.email,{s:'20px',d:'retro'})} alt={data.email}>  
                </ProfileImg>
                {showUserMenu && 
                <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>

                <ProfileModal>
                  <img src={gravatar.url(data.email, { s: '36px', d: 'retro' })} alt={data.nickname} />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                  
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                </Menu> }
                </span>
                
                </RightMenu>}
        </Header>
    <button onClick ={onLogout}>로그아웃</button>
    <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
            <WorkspaceName>sleact</WorkspaceName>
            <MenuScroll>
                menuscroll
            </MenuScroll>
        </Channels>
        <Chats>
          <Outlet></Outlet>
        </Chats>
    </WorkspaceWrapper>
    {children}
    </div>
  )
}

export default Workspace