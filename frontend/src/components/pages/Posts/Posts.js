import React from 'react';
import {Link, withRouter} from 'react-router-dom';

function posts({posts, addPost, deletePost, location: {pathname}}) {
  let inputRef;

  function handleClick(e) {
    e.preventDefault();
    addPost(inputRef.value);
  }

  return (
    <div>
      <h2>Бойові пости</h2>
      <ul>
        {
          posts.map(({_id, name}) => <li key={_id}>
            <Link to={`${pathname}/posts/${_id}`}>{name}</Link>
            <button onClick={() => deletePost(_id)}>Delete</button>
          </li>)
        }
      </ul>
      <form>
        <label>
          New post{' '}<input type='text' name='postName' ref={el => inputRef = el}/>
        </label>
        <button onClick={handleClick}>Add post</button>
      </form>
    </div>
  );
}

export default withRouter(posts);