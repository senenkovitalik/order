import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Posts extends React.Component {
  state = {
    postName: '',
    posts: []
  };

  addPost = e => {
    e.preventDefault();
    const { unitId } = this.props.match.params;
    const requestBody = {
      query: `
          mutation CreatePost($unitId: ID!, $postName:String!) {
            createPost(unitId: $unitId, postName: $postName) {
              _id
              name
            }
          }
        `,
      variables: {
        unitId,
        postName: this.state.postName
      }
    };

    axios.post('/graphql',
      {},
      {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        const post = res.data.data.createPost;
        this.setState(prevState => ({
          posts: [...prevState.posts, post]
        }));
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Posts</h2>
        <ul>
          {
            this.state.posts.map(({_id, name}) => <li key={_id}>
              <Link to={`${this.props.location.pathname}/${_id}`}>{name}</Link>
            </li>)
          }
        </ul>
        <form>
          <label>
            New post{' '}<input type='text' name='postName' onChange={this.handleChange}/>
          </label>
          <button onClick={this.addPost}>Add post</button>
        </form>
      </div>
    );
  }

  componentDidMount() {
    const { unitId: id } = this.props.match.params;
    const requestBody = {
      query: `
          query Unit($id: ID!) {
            unit(id: $id) {
              posts {
                _id
                name
              }
            }
          }
        `,
      variables: {
        id
      }
    };

    axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        const { posts } = res.data.data.unit;
        this.setState({
          posts
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export default Posts;