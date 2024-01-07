import React from 'react'
import Workspace from '@layouts/Workspace'
import { Container } from './styles'
import gravatar from 'gravatar'
import { Header,DragOver } from './styles'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
const DirectMessage = () => {
  
    const {data:userData} = useSWR('/api/users',fetcher)

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>

      <DragOver>업로드!</DragOver>
    </Container>
     
  )
}

export default DirectMessage