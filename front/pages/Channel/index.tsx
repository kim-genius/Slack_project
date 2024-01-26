import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { IChannel, IChat, IUser } from '@typings/db'
import makeSection from '@utils/makeSection'
import Scrollbars, { ScrollbarProps } from 'react-custom-scrollbars'
import useSocket from '@hooks/useSocket';
import InviteChannelModal from '@components/InviteChannelModal';

const Channel = () => {
  const [showInviteChannelModal,setShowInviteChannelModal] = useState(false)

  const {workspace,channel}=useParams<{workspace:string,channel:string}>()
  const {data:userData} = useSWR(`/api/workspaces/${workspace}/users/${channel}`,fetcher)
  const {data:chatData,mutate:mutateChat,setSize} = useSWRInfinite<IChat[]>((index)=>`/api/workspaces/${workspace}/dms/${channel}/chats?perPage=20&page=${index + 1}`,fetcher)
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const [socket] = useSocket(workspace)
  const {data:myData} = useSWR(`/api/users`,fetcher)
  const {data:channelMembersData} = useSWR<IUser[]>(myData? `/api/workspaces/${workspace}/channels/${channel}/members`:null,fetcher)
  const {data:channelData} = useSWR<IChannel>(`api/workspaces/${workspace}/channels/${channel}`,fetcher)
  const [chat,onChangeChat,setChat] =useInput('')
  const  scrollRef = useRef<Scrollbars>(null)

  const onSubmitForm = useCallback((e:any)=>{
    e.preventDefault(); 
    if(chat?.trim() && chatData && channelData){
      const savedChat = chat;
      mutateChat((prevChatData)=>{
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          UserId: myData.id,
          User: myData,
          ChannelId: channelData.id,
          Channel: channelData,
          createdAt: new Date(),
        })  
        return prevChatData;
      },false)
      .then(()=>{
        setChat('') ,
         scrollRef.current?.scrollToBottom()

      })
   
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`,{content:chat})
      .then((res:any)=>{setChat(''),mutateChat()})
      .catch(console.error)
    }
   
  },[chat,chatData,myData,userData,workspace,channel])

  const onMessage = useCallback((data:IChat)=>{
    if (data.Channel.name === channel && data.UserId  !== myData?.UserId) {
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
  },[channel])
  useEffect(()=>{
      socket?.on('message',onMessage)
      return()=>{
        socket?.off('message',onMessage)
      }

  },[socket,channel,myData])
//로딩 시 스크롤 바 제일 아래로
  useEffect(()=>{if(chatData?.length === 1){scrollRef.current?.scrollToBottom()}},[chatData])
  const onClickInviteChannel = useCallback(()=>{
    setShowInviteChannelModal(true)
  },[])
  const onCloseModal = useCallback(()=>{
    setShowInviteChannelModal(false)
  },[])


  if(!userData ||!myData){return null}

  const chatSections = makeSection(chatData? chatData.flat().reverse():[])


  return ( 
    <Container>
      <Header>
      <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList 
      chatSections={chatSections} 
      ref ={scrollRef} setSize={setSize} isReachingEnd={isReachingEnd}></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
      {/* <DragOver>업로드!</DragOver> */}
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>

  )
} 

export default Channel