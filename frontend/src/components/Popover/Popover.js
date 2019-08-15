import React from 'react';
import PropTypes from 'prop-types';
import './Popover.css';

class Popover extends React.Component {
  state = {
    isHovered: false
  };

  handleMouseMoves = e => {
    this.setState({
      isHovered: e.type === 'mouseover'
    })
  };

  calcStyle = () => {
    const styles = ['popover__content'];
    if (this.state.isHovered || this.props.isShown) {
      styles.push('popover__content_shown');
    }
    return styles.join(' ');
  };

  // calc popover coordinates
  calcCoordinates = () => ({
    left: `${this.props.position.x}px`,
    top: `${this.props.position.y - 10}px`
  });

  // check day, hide popover
  handleClick = e => {
    const dutyValue = e.nativeEvent.target.dataset.value;
    this.props.checkDay(dutyValue);
    this.props.togglePopover(false, e);
  };

  render() {
    const dutyData = [
      { label: '1', value: '100' },
      { label: '1/2', value: '110' },
      { label: '1/3', value: '101' },
      { label: '2/3', value: '011' },
      { label: '2', value: '010' },
      { label: '3', value: '001' },
    ];
    const dutyContent = dutyData.map(({ value, label }, i) => <li key={i} data-value={value}>{label}</li>);

    return (
      <div onMouseOver={this.handleMouseMoves}
           onMouseLeave={this.handleMouseMoves}
           className="popover"
           style={this.calcCoordinates()}>
        <div className={this.calcStyle()}>
          <ul onClick={this.handleClick}>
            {dutyContent}
          </ul>
        </div>
      </div>
    );
  }
}

Popover.propTypes = {
  isShown: PropTypes.bool,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  checkDay: PropTypes.func,
  togglePopover: PropTypes.func
};

export default Popover;
