import { useCallback } from 'react';
import io from 'socket.io-client';

const backUrl ='http://localhost:3095';
const sockets:{[key:string]:SocketIOClient.Socket}={};
const useSocket = (workspace?:string):[SocketIOClient.Socket|undefined,()=>void]=>{

    const disconnect = useCallback(()=>{
        if(workspace){sockets[workspace].disconnect();delete sockets[workspace]}
},[])
    if(!workspace){return [undefined,disconnect];}
    if(!sockets[workspace]){
        sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`,{
            transports:['websocket'],
        });
    }
    
    sockets[workspace].emit('hello','world');
    sockets[workspace].on('message',(data:any)=>{
        console.log(data)
    })
    sockets[workspace].on('data',(data:any)=>{
        console.log(data)
    })
    sockets[workspace].on('onlineList',(data:any)=>{
        console.log(data)
    })
   
    return [sockets[workspace],disconnect]
}
export default useSocket;