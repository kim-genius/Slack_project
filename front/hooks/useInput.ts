import React,{useState,useCallback,Dispatch,SetStateAction, ChangeEvent} from 'react'

type Handler = (e:any) => void;
type ReturnTypes<T = any> = [T, Handler, Dispatch<SetStateAction<T>>];


const useinput =<T= any> (initialData:T):ReturnTypes<T> => {
    const [value,setValue] = useState(initialData);
    const handler = useCallback((e:ChangeEvent<HTMLInputElement>)=>{
            setValue(e.target.value as unknown as T)
    },[]);
    return [value,handler,setValue];
}

export default useinput;