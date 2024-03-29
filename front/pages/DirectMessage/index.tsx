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

import useSocket from '@hooks/useSocket';
const DirectMessage = () => {
  
  const {workspace,id}=useParams<{workspace:string,id:string}>()
  const {data:userData} = useSWR(`/api/workspaces/${workspace}/users/${id}`,fetcher)
  const {data:chatData,mutate:mutateChat,setSize} = useSWRInfinite<IDM[]>((index)=>`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,fetcher)
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const [socket] = useSocket(workspace)
  const {data:myData} = useSWR(`/api/users`,fetcher)
  
  const [chat,onChangeChat,setChat] =useInput('')
  const  scrollRef = useRef<Scrollbars>(null)
  const onSubmitForm = useCallback((e:any)=>{
    e.preventDefault(); 
    if(chat?.trim() && chatData){
      const savedChat = chat;
      mutateChat((prevChatData)=>{
        prevChatData?.[0].unshift({
          id:(chatData[0][0]?.id||0)+1,
          content:savedChat,
          SenderId:myData.id,
          Sender:myData,
          ReceiverId:userData.id,
          Receiver:userData,
          createdAt:new Date(),
        })  
        return prevChatData;
      },false)
      .then(()=>{
        setChat(''),
         scrollRef.current?.scrollToBottom()

      })
   
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{content:chat})
      .then((res:any)=>{setChat(''),mutateChat()})
      .catch(console.error)
    }
  
  },[chat,chatData,myData,userData,workspace,id])

  const onMessage = useCallback((data:IDM)=>{
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollRef.current) {
          if (
            scrollRef.current.getScrollHeight() <
            scrollRef.current.getClientHeight() + scrollRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollRef.current?.getValues());
            setTimeout(() => {
              scrollRef.current?.scrollToBottom();
            }, 50);
          }
        }
      });
    }
  },[])
  useEffect(()=>{
      socket?.on('dm',onMessage)
      return()=>{
        socket?.off('dm',onMessage)
      }

  },[socket,id,myData])
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
      ref ={scrollRef} setSize={setSize} isReachingEnd={isReachingEnd}></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
      {/* <DragOver>업로드!</DragOver> */}
    </Container>
     
  )
}

export default DirectMessage


