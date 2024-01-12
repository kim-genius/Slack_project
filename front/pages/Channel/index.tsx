import React, { useCallback } from 'react'
import Workspace from '@layouts/Workspace'
import { Container,Header } from './styles'
import ChatBox from '@components/ChatBox'
import useInput from '@hooks/useInput'
import ChatList from '@components/ChatList'
const Channel = () => {
    const [chat,onChangeChat,setChat] = useInput('')
    const onSubmitForm = useCallback((e:any)=>{e.preventDefault(),console.log('submit'),setChat('')},[])

  return ( 

    <Container>
    <Header>
      채널
    </Header>
    <ChatList></ChatList>
    <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
  </Container>

  )
} 

export default Channel