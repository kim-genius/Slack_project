import React, { useState,FC ,useCallback, useEffect} from 'react'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import axios from 'axios'
import {LogOutButton, Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, WorkspaceWrapper,Workspaces,ProfileModal, WorkspaceButton, AddButton, WorkspaceModal } from '@layouts/Workspace/styles'
import gravatar from 'gravatar'
import { Outlet, Route,Routes ,useNavigate, useParams} from 'react-router'
import loadable from '@loadable/component'
import Menu from '@components/Menu'
import { Link } from 'react-router-dom'
import { IChannel, IUser } from '@typings/db'
import Modal from '@components/Modal'
import { Input, Label } from '@pages/SignUp/styles'
import { Button } from '@pages/SignUp/styles'
import useinput from '@hooks/useInput'
import {toast} from 'react-toastify'
import CreateChannelModal from '@components/CreateChannelModal'
import InviteWorkspaceModal from '@components/InviteWorkspaceModal'
import InviteChannelModal from '@components/InviteChannelModal'
import ChannelList from '@components/ChannelList'
import DMList from '@components/DMList'
import useSocket from '@hooks/useSocket'
const Workspace = () => {
  const navigate = useNavigate()
  const [showUserMenu,setShowUserMenu] =useState(false)
  const [showWorkspaceModal,setShowWorkspaceModal] =useState(false)
  const [showCreateWorkspaceModal,setShowCreateWorkspaceModal] =useState(false);
  const [showCreateChannelModal,setShowCreateChannelModal] =useState(false);
  const [showInviteWorkspaceModal,setShowInviteWorkspaceModal] =useState(false);
  
  const [showInviteChannelModal,setShowInviteChannelModal] =useState(false);
  const [newWorkspace,onChangeNewWorkspace,setNewWorkspace] = useinput('')
  const [newUrl,onChangeNewUrl,setNewUrl] = useinput('')
 
  const {workspace} = useParams<{workspace:string}>()
  const params = useParams()
  console.log(params)
    const {data:userData,error,mutate} =  useSWR<IUser> ('/api/users',fetcher,{dedupingInterval:2000})
    const {data:channelData} =  useSWR<IChannel[]> (userData? `/api/workspaces/${workspace}/channels`:null,fetcher)
    const {data:memberData} =  useSWR<IUser[]> (userData? `/api/workspaces/${workspace}`:null,fetcher)
    const [socket,disconnect] = useSocket(workspace)
    useEffect(()=>{
      
        if(channelData && userData && socket){
          console.log(socket)
          socket.emit(`login`,{id:userData.id,channels:channelData.map((res)=>{res.id})})
        }
    },[socket,channelData,userData])

    useEffect(()=>{
      return()=>{
        disconnect()
      }
    },[workspace,disconnect])


    const onLogout = useCallback(()=>{ 
            axios.post('/api/users/logout',null,{
                withCredentials:true,
            })
            .then(()=>{mutate()}) //로그아웃

    },[])
const onClickCreateWorkspace = useCallback(()=>{
      setShowCreateWorkspaceModal(true)
  },[])
  const onClickUserProfile = useCallback(()=>{setShowUserMenu((prev)=>!prev)},[])
  const onCloseModal = useCallback(()=>{setShowCreateWorkspaceModal(false),setShowCreateChannelModal(false),setShowInviteWorkspaceModal(false),setShowInviteChannelModal(false)},[])
  const onCloseUsePorfile = useCallback((e:any)=>{e.stopPropagation(),setShowUserMenu(false)},[])
  const onCreateWorkspace = useCallback(
    (e:any) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((err)=>{
          console.dir(err);
          toast.error(err.resonpose?.data,{position:'bottom-center'})
        })
    },
    [newWorkspace, newUrl],
  )
    const onClickInviteWorkspace = useCallback(()=>{setShowInviteWorkspaceModal((prev)=>!prev)},[])
    const toggleWorkspaceModal = useCallback(()=>{setShowWorkspaceModal((prev)=>!prev)},[])
    const onClickAddChannel = useCallback(()=>{setShowCreateChannelModal(true);},[])

  if(!userData){
    navigate('/login')

  }
  
  return (
    <div> 
        <Header>
        {userData &&  <RightMenu>
                <span onClick={onClickUserProfile}>
             <ProfileImg src={gravatar.url(userData.email,{s:'20px',d:'retro'})} alt={userData.email}>  
                </ProfileImg>
                {showUserMenu && 
                <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUsePorfile}>

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
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
          </Workspaces>
        <Channels>
            <WorkspaceName onClick={toggleWorkspaceModal}>GeniusChat</WorkspaceName>
            <MenuScroll>
                <Menu show={showWorkspaceModal} onCloseModal ={toggleWorkspaceModal} style={{top:95, left:80}}>
                  <WorkspaceModal>
                    
                    <h2>Sleact</h2> 
                    <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                    <button onClick={onClickAddChannel}>채널 만들기</button>
                    <button onClick={onLogout}>로그아웃</button>
                  </WorkspaceModal>

                </Menu>
                <ChannelList></ChannelList>
                <DMList></DMList>
                {channelData?.map((res)=><div>{res.name}</div>)}
            </MenuScroll>
        </Channels>
        <Chats>
          <Outlet></Outlet>
        </Chats>
    </WorkspaceWrapper>
    <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
          <form onSubmit ={onCreateWorkspace}>
            <Label id ="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id ='workspace' value={newWorkspace} onChange={onChangeNewWorkspace}></Input>
            </Label>
            <Label id ="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id ='workspace' value={newUrl} onChange={onChangeNewUrl}></Input>
            </Label>
            <Button type='submit'>생성하기</Button>
          </form>

    </Modal>
    <CreateChannelModal show ={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal}></CreateChannelModal>
    <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}></InviteWorkspaceModal>
    <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal}></InviteChannelModal>
    </div>
  )
}

export default Workspace