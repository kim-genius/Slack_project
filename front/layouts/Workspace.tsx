import React, { FC } from 'react'
import { useCallback } from 'react'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { revalidateEvents } from 'swr/_internal'

const Workspace : FC<React.PropsWithChildren<{}>>= ({children}) => {
  const navigate = useNavigate()
    const {data,error,mutate} =  useSWR('http://localhost:3095/api/users',fetcher)

    const onLogout = useCallback(()=>{ 
            axios.post('http://localhost:3095/api/users/logout',null,{
                withCredentials:true,
            })
            .then((res)=>{mutate(res.data,{revalidate : false})})

    },[])
  if(!data){
    navigate('/login')

  }
  return (
    <div>
    <button onClick ={onLogout}>로그아웃</button>
    {children}
    </div>
  )
}

export default Workspace