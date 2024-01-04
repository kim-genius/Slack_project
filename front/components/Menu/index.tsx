import { CreateMenu, CloseModalButton } from '@components/Menu/styles';
import React, { CSSProperties, FC, PropsWithChildren, useCallback } from 'react';

interface Props {
    show:boolean;
    style:CSSProperties,
    onCloseModal:((e:any)=>void),
    closeButton?:boolean
}

const Menu:  FC<PropsWithChildren<Props>>= ({children,style,show,onCloseModal,closeButton}) => {
    const stopPropagation = useCallback((e:any)=>{e.stopPropagation()},[])
    if(!show) return null
  return (
    <CreateMenu onClick={onCloseModal}>
        <div style = {style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>X</CloseModalButton>}
        {children}
        </div>
    </CreateMenu>
    
  );
};
Menu.defaultProps={
    closeButton:true

}

export default Menu;