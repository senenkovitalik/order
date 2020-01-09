import React, {useContext, useState} from 'react';
import {DutyContext} from '../DutyContext';
import './Popover.css';

function Popover() {
  const {isPopoverShown, popoverPosition: {x, y}, checkDuty} = useContext(DutyContext);
  const [isHovered, setHovered] = useState(false);

  const calculatePosition = (x, y) => ({left: `${x}px`, top: `${y - 10}px`});

  const calculateClassNames = () => isHovered || isPopoverShown
    ? 'popover__content popover__content_shown'
    : 'popover__content';

  // check day, hide popover
  const handleClick = e => checkDuty(e.nativeEvent.target.dataset.value);

  const dutyData = [
    {label: '1', value: '100'},
    {label: '1/2', value: '110'},
    {label: '1/3', value: '101'},
    {label: '2/3', value: '011'},
    {label: '2', value: '010'},
    {label: '3', value: '001'},
  ];
  const dutyContent = dutyData.map(({value, label}, i) => <li key={i} data-value={value}>{label}</li>);

  return (
    <div className="popover" style={calculatePosition(x, y)}
         onMouseOver={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}>
      <div className={calculateClassNames()}>
        <ul onClick={handleClick}>
          {dutyContent}
        </ul>
      </div>
    </div>
  );
}

export default Popover;
