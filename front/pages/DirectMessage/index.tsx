import React, { useCallback, useRef } from 'react'
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
import makeSection from '@utils/makeSection'
import Scrollbars, { ScrollbarProps } from 'react-custom-scrollbars'
const DirectMessage = () => {

  const {workspace,id}=useParams<{workspace:string,id:string}>()
  const {data:userData} = useSWR(`/api/workspaces/${workspace}/users/${id}`,fetcher)
  const {data:chatData,mutate:mutateChat} = useSWR<IDM[]>(`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,fetcher)
  const {data:myData} = useSWR(`/api/users`,fetcher)
  
  const [chat,onChangeChat,setChat] =useInput('')
  const  scrollRef = useRef<Scrollbars>(null)
  const onSubmitForm = useCallback((e:any)=>{
    e.preventDefault();
    if(chat?.trim()){
   
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{content:chat})
      .then((res:any)=>{setChat(''),mutateChat()})
      .catch(console.error)
    }
  
  },[chat])
  if(!userData ||!myData){return null}

  const chatSections = makeSection(chatData? [...chatData].reverse():[])
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref ={scrollRef}></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
      {/* <DragOver>업로드!</DragOver> */}
    </Container>
     
  )
}

export default DirectMessage