import React, { useCallback } from 'react'
import Workspace from '@layouts/Workspace'
import { Container } from './styles'
import gravatar from 'gravatar'
import { Header,DragOver } from './styles'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import { useParams } from 'react-router'
import ChatBox from '@components/ChatBox'
import ChatList from '@components/ChatList'
import useInput from '@hooks/useInput'
import axios from 'axios'
import { IDM } from '@typings/db'
const DirectMessage = () => {

  const {workspace,id}=useParams<{workspace:string,id:string}>()
  const {data:userData} = useSWR(`/api/workspaces/${workspace}/users/${id}`,fetcher)
  const {data:chatData,mutate:mutateChat} = useSWR<IDM[]>(`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,fetcher)
  const {data:myData} = useSWR(`/api/users`,fetcher)
  
  const [chat,onChangeChat,setChat] =useInput('')
  const onSubmitForm = useCallback((e:any)=>{
    e.preventDefault();
    if(chat?.trim()){
      console.log('err뜨냐')
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{content:chat})
      .then((res:any)=>{setChat(''),mutateChat()})
      .catch(console.error)
    }
  
  },[chat])
  if(!userData ||!myData){return null}
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
      {/* <DragOver>업로드!</DragOver> */}
    </Container>
     
  )
}

export default DirectMessage