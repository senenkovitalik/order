import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import Backdrop from '../../../components/Backdrop/Backdrop';
import Modal from '../../../components/Modal/Modal';
import CreateUnitForm from '../CreateUnitForm/CreateUnitForm';

const UNIT = loader('../queries/UNIT.graphql');
const CREATE_UNIT = loader('./CREATE_UNIT.graphql');

export default function Units({ unitId, childUnits, employees, showAlert }) {
  const [isModalShown, setModalVisibility] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [createUnitMutation] = useMutation(CREATE_UNIT, {
    update: (cache, { data: { createUnit } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: unitId
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: unitId
        },
        data: {
          unit: Object.assign({}, unit, { childUnits: unit.childUnits.concat(createUnit) })
        }
      });
    },
    onCompleted: () => {
      setModalVisibility(false);
      showAlert(true, 'Підрозділ додано успішно.');
    },
    onError: (error) => {
      showAlert(false);
      setCreateError(error);
    }
  });

  const createUnit = unitData => createUnitMutation({
    variables: {
      parentUnit: unitId,
      unit: unitData
    }
  });

  return (
    <div>
      <h2>Підрозділи</h2>
      {!!childUnits.length
        ? <ul>
          {childUnits.map(({ _id, name }) => <li key={_id}>
            <Link to={`/unit/${_id}`}>{name}</Link>
            <button type='button'>Видалити</button>
          </li>)}
        </ul>
        : <div>Нічого не знайдено</div>}
      <button onClick={() => setModalVisibility(true)}>Додати підрозділ</button>

      {isModalShown && <React.Fragment>
        <Backdrop closeModal={() => setModalVisibility(false)}/>
        <Modal>
          <CreateUnitForm employees={employees} createUnit={createUnit} close={() => setModalVisibility(false)}
                          error={createError}/>
        </Modal>
      </React.Fragment>}
    </div>
  );
}