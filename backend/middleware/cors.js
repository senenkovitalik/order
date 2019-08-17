module.exports = function cors(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};
