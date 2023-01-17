const session = require('express-session');
const store = require('better-express-store');
const acl = require('./acl');
const passwordEncryptor = require('./passwordEncryptor');
const passwordField = 'password';

// salt for cookie hash generation
let salt = 'someUnusualStringThatIsUniqueForThisProject';

// if we are running in production mode and no password salt or short password salt exit

if (!process.env.COOKIE_SALT) {
  console.log('Using default COOKIE_SALT');
  
}
else {
    salt = process.env.COOKIE_SALT;
}



module.exports = function (app, db) {
  app.use(session({
    secret: salt,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    store: store({ dbPath: './database/bookshop.db' })
  }));

  app.post('/api/login', (req, res) => {
    if (!acl('login', req)) {
      res.status(405);
      res.json({ _error: 'Not allowed' });
    }
    req.body[passwordField] =
      passwordEncryptor(req.body[passwordField]);
    let stmt = db.prepare(`
      SELECT * FROM customers
      WHERE email = :email AND password = :password
    `);
    let result = stmt.all(req.body)[0] || { _error: 'No such user.' };
    delete result.password;
    if (!result._error) {
      req.session.user = result;
    }
    res.json(result);
  });

  app.get('/api/login', (req, res) => {
    if (!acl('login', req)) {
      res.status(405);
      res.json({ _error: 'Not allowed' });
    }
    res.json(req.session.user || { _error: 'Not logged in' });
  });

  app.delete('/api/login', (req, res) => {
    if (!acl('login', req)) {
      res.status(405);
      res.json({ _error: 'Not allowed' });
    }
    delete req.session.user;
    res.json({ success: 'logged out' });
  });

}
