import React from 'react';
import './Alert.css';
import PropTypes from 'prop-types';

export default class Alert extends React.Component {
  state = {
    isShown: true
  };

  handleClick = () => {
    this.setState({
      isShown: false
    });
  };

  render() {
    const styleClass = this.props.success ? 'alert-success' : 'alert-error';
    return this.state.isShown ? (
      <div className={`alert ${styleClass}`}>
        {this.props.children}
        <span className='close' onClick={this.handleClick}>{}</span>
      </div>
    ) : null;
  }
};

Alert.propTypes = {
  success: PropTypes.bool
};
