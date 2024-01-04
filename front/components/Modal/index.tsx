import { CloseModalButton, CreateModal } from '@components/Modal/styles';
import React, { FC, useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  children? : React.ReactNode;


}
const Modal: React.FC<Props> = ({ show,  onCloseModal,children }) => {
  const stopPropagation = useCallback((e:any) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;