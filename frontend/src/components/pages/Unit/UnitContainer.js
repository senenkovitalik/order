import React from 'react';
import Posts from "../Posts/Posts";
import Unit from "./Unit";
import {withRouter} from 'react-router-dom';
import axios from "axios";
import Spinner from "../../Spiner/Spinner";
import Alert from "../../Alert/Alert";

class UnitContainer extends React.Component {
  state = {
    unit: null,
    posts: [],
    isAlertShown: false,
    isAlertSuccess: true,
    alertContent: ''
  };

  addPost = postName => {
    const {_id: unitId} = this.state.unit;
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
        postName
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
          posts: [...prevState.posts, post],
          isAlertShown: true,
          isAlertSuccess: true,
          alertContent: 'Пост вдало додано'
        }));
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAlertShown: true,
          isAlertSuccess: false,
          alertContent: 'Щось трапилося. Звернуться до адміністратора.'
        });
      });
  };

  deletePost = postId => {
    const {_id: unitId} = this.state.unit;
    const requestBody = {
      query: `
          mutation CreatePost($unitId: ID!, $postId: ID!) {
            deletePost(unitId: $unitId, postId: $postId) {
              _id
            }
          }
        `,
      variables: {
        unitId,
        postId
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
        const {_id} = res.data.data.deletePost;
        this.setState(prevState => ({
          posts: [...prevState.posts.filter(e => e._id !== _id)],
          isAlertShown: true,
          isAlertSuccess: true,
          alertContent: 'Пост вдало видалено'
        }));
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAlertShown: true,
          isAlertSuccess: false,
          alertContent: 'Щось трапилося. Звернуться до адміністратора.'
        });
      });
  };

  triggerAlert = () => this.setState(prevState => ({isAlertShown: !prevState.isAlertShown}));

  render() {
    return this.state.unit ? (
      <React.Fragment>
        {
          this.state.isAlertShown && <Alert success={this.state.isAlertSuccess} dismiss={this.triggerAlert}>
            {this.state.alertContent}
          </Alert>
        }
        <h1>{this.state.unit.name}</h1>
        <Unit unit={this.state.unit}/>
        <Posts posts={this.state.posts}
               addPost={this.addPost}
               deletePost={this.deletePost}/>
      </React.Fragment>
    ) : (
      <div style={{display: 'flex', justifyContent: 'center', padding: '3rem'}}>
        <Spinner/>
      </div>
    );
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const {unitId} = this.props.match.params;
    if (unitId && token) {
      const requestBody = {
        query: `query Unit($id: ID!) {
          unit(id: $id) {
            _id
            name
            head {
              _id
              name
              surname
              patronymic
              rank { name }
              position { 
                name
                juniorPositions {
                  _id
                  name
                }
              }
            }
            employees {
              _id
              rank {
                _id
                index
                name
                shortName
              }
              position {
                name
                shortName
              }
              name
              surname
              patronymic
              dateOfBirth
              addressOfResidence {
                _id
                region
                district
                city
                village
                urbanVillage
                street
                houseNumber
                apartmentNumber
              }
              registrationAddress {
                _id
                region
                district
                city
                village
                urbanVillage
                street
                houseNumber
                apartmentNumber
              }
            }
            posts {
              _id
              name
            }
          }
        }`,
        variables: {id: unitId}
      };
      axios.get('/graphql', {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {'Authorization': `Bearer ${token}`}
      })
        .then(res => {
          const {unit} = res.data.data;
          this.setState({
            unit,
            posts: unit.posts
          });
        })
        .catch(err => {
          console.error(err)
        });
    }
  }
}

export default withRouter(UnitContainer);