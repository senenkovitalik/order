const convertDate = (dateInMilliseconds) => {
  if (!dateInMilliseconds) {
    return '';
  }
  const d = new Date(parseInt(dateInMilliseconds));
  return `${d.getFullYear()}-${d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth()}-${d.getDate()}`;
};

export default convertDate;