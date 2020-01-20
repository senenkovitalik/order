import React, { useState } from 'react';
import Backdrop from "../../../components/Backdrop/Backdrop";
import Modal from "../../../components/Modal/Modal";
import FormInput from "../../../components/form/FormInput/FormInput";
import FormButton from "../../../components/form/FormButton/FormButton";
import { loader } from "graphql.macro";
import { useMutation } from "@apollo/react-hooks";

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';

const actionMap = {
  CREATE: 'Додати посаду',
  UPDATE: 'Оновити дані про посаду'
};

const CREATE_POSITION = loader('./CREATE_POSITION.graphql');
const UPDATE_POSITION = loader('./UPDATE_POSITION.graphql');

export default function Positions({ positions, showAlert }) {
  const [isModalShown, setModalVisibility] = useState(false);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState(null);

  const [id, setID] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');

  const [createPosition] = useMutation(CREATE_POSITION, {
    onCompleted: () => {
      showAlert(true, 'Посаду додано успішно.');
      setModalVisibility(false);
    },
    onError: error => {
      showAlert(false);
      setError(error);
    }
  });

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onCompleted: () => {
      showAlert(true, 'Дані про посаду оновлено успішно.');
      setModalVisibility(false);
    },
    onError: error => {
      showAlert(false);
      setError(error);
    }
  });

  const actionHandler = (actionType, positionToUpdate) => {
    setActionType(actionType);
    switch (actionType) {
      case UPDATE:
        setID(positionToUpdate._id);
        fillForm(positionToUpdate);
        break;
      case CREATE:
        clearForm();
        break;
      default:
        break;
    }
    setModalVisibility(true);
  };

  const fieldHandler = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'shortName':
        setShortName(value);
        break;
      default:
        break;
    }
  };

  const fillForm = position => {
    setName(position.name);
    setShortName(position.shortName);
  };

  const clearForm = () => {
    setName('');
    setShortName('');
  };

  const submitForm = () => {
    switch (actionType) {
      case UPDATE:
        updatePosition({
          variables: {
            id,
            positionData: {
              name,
              shortName
            }
          }
        });
        break;
      case CREATE:
        createPosition({
          variables: {
            positionData: {
              name,
              shortName
            }
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h2>Посади</h2>

      {positions && <ul>
        {positions.map((position) => <li key={position._id}>
          {position.name}
          {' '}
          <button onClick={() => actionHandler('UPDATE', position)}>Оновити</button>
        </li>)}
      </ul>}

      <button onClick={() => actionHandler('CREATE')}>Додати посаду</button>

      {isModalShown && <React.Fragment>
        <Backdrop closeModal={() => setModalVisibility(false)}/>
        <Modal>
          <form onSubmit={e => {
            e.preventDefault();
            submitForm();
          }}>
            <h3>{actionMap[actionType]}</h3>
            {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}
            <FormInput type={'text'} name={'name'} fieldName={'Назва'} value={name} handler={fieldHandler}/>
            <br/>
            <FormInput type={'text'} name={'shortName'} fieldName={'Скорочена назва'} value={shortName}
                       handler={fieldHandler}/>
            <br/>
            <FormButton type={'submit'} isDisabled={!(name && shortName)}>OK</FormButton>
            <FormButton isDisabled={!(name || shortName)} clickHandler={clearForm}>Очистити</FormButton>
            <FormButton clickHandler={() => setModalVisibility(false)}>Відмінити</FormButton>
          </form>
        </Modal>
      </React.Fragment>}
    </div>
  );
}