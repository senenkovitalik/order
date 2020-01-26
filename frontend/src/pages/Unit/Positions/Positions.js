import React, { useState } from 'react';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import ModalLayout from '../../../components/ModalLayout/ModalLayout';
import Form from '../../../components/form/Form/Form';

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';
const DELETE = 'DELETE';

const actionMap = {
  CREATE: 'Додати посаду',
  UPDATE: 'Оновити дані про посаду'
};

const UNIT = loader('../UNIT.graphql');
const CREATE_POSITION = loader('./CREATE_POSITION.graphql');
const UPDATE_POSITION = loader('./UPDATE_POSITION.graphql');
const DELETE_POSITION = loader('./DELETE_POSITION.graphql');

export default function Positions({ unitID, seniorPositionID, positions, showAlert }) {
  const [isModalShown, setModalVisibility] = useState(false);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState(null);

  const [id, setID] = useState('');  // for UPDATE
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');

  const [createPosition] = useMutation(CREATE_POSITION, {
    update: (cache, { data: { createPosition } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: unitID
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: unitID
        },
        data: {
          unit: Object.assign({}, unit, {
            head: Object.assign({}, unit.head, {
              position: Object.assign({}, unit.head.position, {
                juniorPositions: unit.head.position.juniorPositions.concat([createPosition])
              })
            })
          })
        }
      });
    },
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
    // todo: fix it
    update: (cache, { data: { updatePosition } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: unitID
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: unitID
        },
        data: {
          unit: Object.assign({}, unit, {
            head: Object.assign({}, unit.head, {
              position: Object.assign({}, unit.head.position, {
                juniorPositions: unit.head.position.juniorPositions.map(juniorPosition =>
                  juniorPosition._id === updatePosition._id
                    ? updatePosition
                    : juniorPosition
                )
              })
            })
          })
        }
      });
    },
    onCompleted: () => {
      showAlert(true, 'Дані про посаду оновлено успішно.');
      setModalVisibility(false);
    },
    onError: error => {
      showAlert(false);
      setError(error);
    }
  });

  const [deletePosition] = useMutation(DELETE_POSITION, {
    update: (cache, { data: { deletePosition } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: unitID
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: unitID
        },
        data: {
          unit: Object.assign({}, unit, {
            head: Object.assign({}, unit.head, {
              position: Object.assign({}, unit.head.position, {
                juniorPositions: unit.head.position.juniorPositions.filter(({ _id }) => _id !== deletePosition._id)
              })
            })
          })
        }
      });
    },
    onCompleted: () => {
      showAlert(true, 'Посаду видалено успішно.');
      setModalVisibility(false);
    },
    onError: error => {
      showAlert(false);
      setError(error);
    }
  });

  const actionHandler = (actionType, position) => {
    setActionType(actionType);

    if (actionType === CREATE) {
      clearForm();
      setModalVisibility(true);
    }

    if (actionType === UPDATE) {
      fillForm(position);
      setID(position._id);
      setModalVisibility(true);
    }

    if (actionType === DELETE) {
      const res = window.confirm(`Ви дійсно хочете видалити посаду '${position.name}'?`);
      if (!res) {
        return;
      }
      deletePosition({
        variables: {
          id: position._id
        }
      });
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

  const submitHandler = event => {
    event.preventDefault();

    switch (actionType) {
      case UPDATE:
        updatePosition({
          variables: {
            id,
            positionData: {
              name,
              shortName,
              seniorPosition: seniorPositionID
            }
          }
        });
        break;
      case CREATE:
        createPosition({
          variables: {
            positionData: {
              name,
              shortName,
              seniorPosition: seniorPositionID
            }
          }
        });
        break;
      default:
        break;
    }
  };

  const hideModal = () => setModalVisibility(false);

  const formConfigObject = {
    fields: [
      {
        type: 'text',
        name: 'name',
        label: 'Назва',
        value: name,
        handler: e => setName(e.target.value)
      },
      {
        type: 'text',
        name: 'shortName',
        label: 'Скорочена назва',
        value: shortName,
        handler: e => setShortName(e.target.value)
      }
    ],
    buttons: [
      {
        type: 'submit',
        isDisabled: false,
        title: 'OK'
      },
      {
        isDisabled: false,
        clickHandler: clearForm,
        title: 'Очистити'
      },
      {
        clickHandler: hideModal,
        title: 'Відмінити'
      }
    ]
  };

  return (
    <div>
      <h2>Посади</h2>

      {positions && <ul>
        {positions.map((position) => <li key={position._id}>
          {position.name}
          {' '}
          <button onClick={() => actionHandler(UPDATE, position)}>Оновити</button>
          <button onClick={() => actionHandler(DELETE, position)}>Видалити</button>
        </li>)}
      </ul>}

      <button onClick={() => actionHandler(CREATE)}>Додати посаду</button>

      {isModalShown &&
      <ModalLayout hide={hideModal}>
        <Form configObject={formConfigObject} header={actionMap[actionType]} error={error}
              submitHandler={submitHandler}/>
      </ModalLayout>}
    </div>
  );
}