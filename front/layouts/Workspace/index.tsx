import React, { FC ,useCallback} from 'react'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import axios from 'axios'
import { Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, WorkspaceWrapper,Workspaces } from '@layouts/Workspace/styles'
import gravatar from 'gravatar'
import { Route,Routes ,useNavigate} from 'react-router'
import loadable from '@loadable/component'

const Channel = loadable(()=>import('@pages/Channel'))
const DirectMessage = loadable(()=>import('@pages/DirectMessage'))


const Workspace : FC<React.PropsWithChildren<{}>>= ({children}) => {
  const navigate = useNavigate()
    const {data,error,mutate} =  useSWR('http://localhost:3095/api/users',fetcher)

    const onLogout = useCallback(()=>{ 
            axios.post('http://localhost:3095/api/users/logout',null,{
                withCredentials:true,
            })
            .then(()=>{mutate()})

    },[])
  if(!data){
    navigate('/login')

  }
  return (
    <div> 
        <Header>
            <RightMenu>
                <span>
              {data &&  <ProfileImg src={gravatar.url(data.email,{s:'20px',d:'retro'})} alt={data.email}>  
                </ProfileImg>}
                </span>
                </RightMenu>
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
          <Routes>
          <Route path="/channel" element={<Channel></Channel>}></Route>
          <Route path="/dm" element={<DirectMessage></DirectMessage>}></Route>
          </Routes>
        </Chats>
    </WorkspaceWrapper>
    {children}
    </div>
  )
}

export default Workspace