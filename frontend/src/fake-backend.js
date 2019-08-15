const users = [
  {
    id: '8d53',
    username: 'test',
    password: 'test'
  }
];

const login = (username, password) => {
  if (!(username || password)) {
    return false;
  }

  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
};

export {
  login
};