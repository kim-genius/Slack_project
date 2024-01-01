import React, { useState,FC ,useCallback, useEffect} from 'react'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import axios from 'axios'
import {LogOutButton, Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, WorkspaceWrapper,Workspaces,ProfileModal, WorkspaceButton, AddButton } from '@layouts/Workspace/styles'
import gravatar from 'gravatar'
import { Outlet, Route,Routes ,useNavigate} from 'react-router'
import loadable from '@loadable/component'
import Menu from '@components/Menu'
import { Link } from 'react-router-dom'
import { IUser } from '@typings/db'


const Workspace : FC<React.PropsWithChildren<{}>>= ({children}) => {
  const navigate = useNavigate()
  const [showUserMenu,setShowUserMenu] =useState(false)
    const {data:userData,error,mutate} =  useSWR<IUser> ('http://localhost:3095/api/users',fetcher,{dedupingInterval:2000})
    const onClickCreateWorkspace = useCallback(()=>{

    },[])
    const onLogout = useCallback(()=>{ 
            axios.post('http://localhost:3095/api/users/logout',null,{
                withCredentials:true,
            })
            .then(()=>{mutate()})

    },[])
  const onClickUserProfile = useCallback(()=>{setShowUserMenu((prev)=>!prev)},[])

  if(!userData){
    navigate('/login')

  }
  console.log(userData)
  return (
    <div> 
        <Header>
        {userData &&  <RightMenu>
                <span onClick={onClickUserProfile}>
             <ProfileImg src={gravatar.url(userData.email,{s:'20px',d:'retro'})} alt={userData.email}>  
                </ProfileImg>
                {showUserMenu && 
                <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>

                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                  
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                </Menu> }
                </span>
                
                </RightMenu>} 
        </Header>

    <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((res:any)=>{
            return(
              <Link key ={res.id} to={`workspace/${123}/channel/일반`}>
                <WorkspaceButton>{res.name.slice(0,1).toUpperCase()}</WorkspaceButton>
              </Link>
            )

          })}
          <AddButton onClick={onClickCreateWorkspace}></AddButton>
          </Workspaces>
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