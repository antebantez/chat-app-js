require('dotenv').config({ path: `${process.cwd()}/../../../.env` });
const { Pool } = require('pg');

const pool = new Pool(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        port: process.env.DATABASE_PORT,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    }
);

module.exports = pool;