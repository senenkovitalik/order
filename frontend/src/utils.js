// date may be Date or String (milliseconds)
const convertDate = date => {
  if (!date) {
    return '';
  }
  const d = date instanceof Date ? date : new Date(parseInt(date));
  return `${d.getFullYear()}-${d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth()}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`;
};

export function getSearchParams(props) {
  const searchProp = props.location.search;
  if (!searchProp.length) {
    return null;
  }
  const searchStr = searchProp.slice(1);
  const parts = searchStr.split('&');
  const searchObj = {};
  parts.forEach(p => {
    const [key, value] = p.split('=');
    searchObj[key] = parseInt(value, 10);
  });
  return searchObj;
}

export default convertDate;