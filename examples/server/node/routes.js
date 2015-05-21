module.exports = function(app) {
  app.use('/auth', require('./auth'));
  app.use('/api/me', require('./api/me'));
};
