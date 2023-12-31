import { CreateMenu, CloseModalButton } from '@components/Menu/styles';
import React, { CSSProperties, FC, PropsWithChildren, useCallback } from 'react';

interface Props {
    show:boolean;
    style:CSSProperties,
    onCloseModal:(()=>void),
    closeButton?:boolean
}

const Menu:  FC<PropsWithChildren<Props>>= ({children,style,show,onCloseModal,closeButton}) => {
    const stopPropagation = useCallback((e:any)=>{e.stopPropagation()},[])
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