import React,{useState,useCallback,Dispatch,SetStateAction} from 'react'

type Handler = (e:any) => void;
type ReturnTypes<T = any> = [T, Handler, Dispatch<SetStateAction<T>>];


const useinput =<T= any> (initialData:T):ReturnTypes<T> => {
    const [value,setValue] = useState(initialData);
    const handler = useCallback((e:any)=>{
            setValue(e.target.value)
    },[]);
    return [value,handler,setValue];
}

export default useinput;