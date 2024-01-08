import React from 'react'
import Workspace from '@layouts/Workspace'
import { Container } from './styles'
import gravatar from 'gravatar'
import { Header,DragOver } from './styles'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import { useParams } from 'react-router'
import ChatBox from '@components/ChatBox'
const DirectMessage = () => {

  const {workspace,id}=useParams<{workspace:string,id:string}>()
  const {data:userData} = useSWR(`/api/workspaces/${workspace}/users/${id}`,fetcher)
  const {data:myData} = useSWR(`/api/users`,fetcher)
  if(!userData ||!myData){return null}
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      {/* <ChatList></ChatList> */}
      <ChatBox chat='hi'></ChatBox>
      <DragOver>업로드!</DragOver>
    </Container>
     
  )
}

export default DirectMessage