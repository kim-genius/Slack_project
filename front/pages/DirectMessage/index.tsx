import React, { useCallback, useEffect, useRef } from 'react'
import { Container } from './styles'
import gravatar from 'gravatar'
import { Header,DragOver } from './styles'
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
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
  const {data:chatData,mutate:mutateChat,setSize} = useSWRInfinite<IDM[]>((index)=>`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,fetcher)
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  
  const {data:myData} = useSWR(`/api/users`,fetcher)
  
  const [chat,onChangeChat,setChat] =useInput('')
  const  scrollRef = useRef<Scrollbars>(null)
  const onSubmitForm = useCallback((e:any)=>{
    e.preventDefault();
    if(chat?.trim()){
   
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{content:chat})
      .then((res:any)=>{setChat(''),mutateChat(),scrollRef.current?.scrollToBottom()})
      .catch(console.error)
    }
  
  },[chat])
//로딩 시 스크롤 바 제일 아래로
  useEffect(()=>{if(chatData?.length === 1){scrollRef.current?.scrollToBottom()}},[chatData])

  if(!userData ||!myData){return null}

  const chatSections = makeSection(chatData? chatData.flat().reverse():[])
  return ( 
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList 
      chatSections={chatSections} 
      ref ={scrollRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
      {/* <DragOver>업로드!</DragOver> */}
    </Container>
     
  )
}

export default DirectMessage


