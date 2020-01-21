import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';

export default function ModalLayout({ hide, children }) {
  return (
    <React.Fragment>
      <Backdrop hide={hide}/>
      <Modal>{children}</Modal>
    </React.Fragment>
  );
}