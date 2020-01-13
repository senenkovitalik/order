// date may be Date or String (milliseconds)
const convertDate = date => {
  if (!date) {
    return '';
  }
  const d = date instanceof Date ? date : new Date(parseInt(date));
  return `${d.getFullYear()}-${d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth()}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`;
};

const getSearchParams = props => {
  const searchProp = props.location.search;
  if (!searchProp.length) {
    return null;
  }
  const searchStr = searchProp.slice(1);
  const parts = searchStr.split('&');
  const searchObj = {};
  parts.forEach(p => {
    const [key, value] = p.split('=');
    searchObj[key] = value;
  });
  return searchObj;
};

const detectHoliday = date => {
  const d = typeof date === 'number'
    ? new Date(date)
    : date;
  return d.getDay() === 0 || d.getDay() === 6;
};

export {convertDate, getSearchParams, detectHoliday};