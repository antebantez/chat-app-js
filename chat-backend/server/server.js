require('dotenv').config({ path: `${process.cwd()}/../.env` });
const { default: pool } = require('../server/api/db')

const express = require('express');
const session = require('express-session')
//const bodyParser = require('body-parser');
const router = require('./api/routes');

const port = process.env.BACKEND_HTTP_PORT;
const api_url = process.env.API_URL;

const server = express();

//server.use(bodyParser.urlencoded());
//server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }))






// salt for cookie hash generation
let salt = 'someUnusualStringThatIsUniqueForThisProject';

// if we are running in production mode and no password salt or short password salt exit

  if(!process.env.COOKIE_SALT){
    console.log('missing env. variable COOKIE_SALT');
    
  }
  else {
    salt = process.env.COOKIE_SALT;
  }


  const conObject = {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        port: process.env.DATABASE_PORT,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
  }
    
const store = new (require('connect-pg-simple')(session))(
    
  {
    conObject: conObject,
    conString: process.env.CON_STRING
  }
  
  )

  server.use(session({
    store: store,
    secret: salt,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    //store: store({ dbPath: `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` })
  }));

  server.use(express.json({limit: '100MB'}));
  server.use(api_url, router);
  

  server.listen(port, () => console.log(`Server live at ${port}`));