import React from 'react';

const contextData = {
  popoverPosition: {x: 0, y: 0},
  setPopoverPosition: () => {},
  isPopoverShown: false,
  setPopoverVisibility: () => {},
  checkDuty: () => {},
  setCurrentEmployeeId: () => {},
  setCurrentDate: () => {}
};

const DutyContext = React.createContext(contextData);

export {DutyContext};