import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Backdrop from '../../../components/Backdrop/Backdrop';
import Modal from '../../../components/Modal/Modal';
import CreatePostForm from './CreatPostForm/CreatePostForm';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';

const UNIT = loader('../UNIT.graphql');
const CREATE_POST = loader('./CREATE_POST.graphql');
const DELETE_POST = loader('./DELETE_POST.graphql');

export default function Posts({ unitId, posts, pathname, showAlert }) {
  const [isModalShown, setModalVisibility] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [createPostMutation] = useMutation(CREATE_POST, {
    update: (cache, { data: { createPost } }) => {
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
          unit: Object.assign({}, unit, { posts: unit.posts.concat(createPost) })
        }
      });
    },
    onCompleted: () => showAlert(true, 'Пост додано успішно.'),
    onError: error => {
      showAlert(false);
      setCreateError(error);
    }
  });
  const [deletePostMutation] = useMutation(DELETE_POST, {
    update: (cache, { data: { deletePost } }) => {
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
          unit: Object.assign(
            {},
            unit,
            { posts: unit.posts.filter(({ _id }) => _id !== deletePost._id) })
        }
      });
    },
    onCompleted: () => showAlert(true, 'Пост видалено успішно.'),
    onError: () => showAlert(false)
  });

  const createPost = postData => createPostMutation({
    variables: {
      unitId: unitId,
      post: postData
    }
  });

  const deletePost = (postId, postName) => {
    const result = window.confirm(`Ви дійсно хочете видалити пост '${postName}'`);
    if (!result) {
      return;
    }
    return deletePostMutation({
      variables: {
        unitId: unitId,
        postId
      }
    });
  };

  return (
    <div>
      <h2>Бойові пости</h2>
      {!!posts.length
        ? <ul>
          {posts.map(({ _id, name }) => <li key={_id}>
            <Link to={`${pathname}/posts/${_id}`}>{name}</Link>
            <button onClick={() => deletePost(_id, name)}>Delete
            </button>
          </li>)}
        </ul>
        : <div>Нічого не знайдено</div>}

      <button onClick={() => setModalVisibility(true)}>Додати пост</button>

      {isModalShown && <React.Fragment>
        <Backdrop closeModal={() => setModalVisibility(false)}/>
        <Modal>
          <CreatePostForm createPost={createPost} close={() => setModalVisibility(false)} error={createError}/>
        </Modal>
      </React.Fragment>}
    </div>
  );
}