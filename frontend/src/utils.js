// date may be Date or String (milliseconds)
const convertDate = date => {
  if (!date) {
    return '';
  }
  const d = date instanceof Date ? date : new Date(parseInt(date));
  return `${d.getFullYear()}-${d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth()}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`;
};

export default convertDate;