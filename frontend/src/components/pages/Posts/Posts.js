import React from 'react';
import {Link, withRouter} from 'react-router-dom';

class Posts extends React.Component {
  state = {
    postName: '',
    canSubmit: false
  };

  handleClick = e => {
    e.preventDefault();
    this.props.addPost(this.state.postName);
  };

  handleChange = e => {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
      canSubmit: value.length > 3
    });
  };

  render() {
    return (
      <div>
        <h2>Бойові пости</h2>
        <ul>
          {this.props.posts.map(({_id, name}) => <li key={_id}>
            <Link to={`${this.props.location.pathname}/posts/${_id}`}>{name}</Link>
            <button onClick={() => this.props.deletePost(_id)}>Delete</button>
          </li>)}
        </ul>
        <form>
          <label>
            New post{' '}
            <input type='text'
                   name='postName'
                   onChange={this.handleChange}
                   title={'Щось типу БП-000 чи 2БП-000'}/>
          </label>
          <button onClick={this.handleClick} disabled={!this.state.canSubmit}>Add post</button>
        </form>
      </div>
    );
  }

  componentDidMount() {

  }
}

export default withRouter(Posts);