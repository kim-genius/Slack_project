import React, { useCallback } from 'react'
import Modal from '@components/Modal'
import { Button,Input,Label } from '@pages/SignUp/styles';
import useinput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel,IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
interface Props {
    show:boolean;
    onCloseModal: ()=> void;
    setShowCreateChannelModal :(flag:boolean)=>void;

}
const CreateChannelModal :React.FC<Props> = ({show,onCloseModal,setShowCreateChannelModal}) => {
    const [newChannel,onChangeNewChannel,setNewChannel] = useinput('')
    const {workspace,channel} = useParams<{workspace:string,channel:string}>()
    const {data:userData,error,mutate} =  useSWR<IUser> ('/api/users',fetcher,{dedupingInterval:2000})
    const {data:channelData,mutate:channelMutate} =  useSWR<IChannel[]> (userData? `/api/workspaces/${workspace}/channels`:null,fetcher)
    
    const onCreateChannel = useCallback((e:any)=>{
      e.preventDefault();
      axios.post(`/api/workspaces/${workspace}/channels`,{
      name:newChannel,
    },{withCredentials:true})
    .then((res)=>{setShowCreateChannelModal(false);setNewChannel('');channelMutate()})
    .catch((err)=>{console.dir(err);toast.error(err.resonpose?.data,{position:'bottom-center'})})
  
  },[newChannel])

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit ={onCreateChannel}>
                    <Label id ="channel-label">
                    <span>채널</span>
                    <Input id ='channel' value={newChannel} onChange={onChangeNewChannel}></Input>
                    </Label>
                    <Button type='submit'>생성하기</Button>
                </form>
                </Modal>

 

  )
}

export default CreateChannelModal