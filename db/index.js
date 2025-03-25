import pkg from 'pg';
import util from 'util';
import config from "../config/index.js";
const { Pool } = pkg;
const sql_pool=new Pool({
    user:config.dbUser,
    database:config.databsase,
    password:config.dbPassword,
    port:config.dbPort,
    idleTimeoutMillis:config.idleTimeoutMillis,
    connectionTimeoutMillis:config.connectionTimeoutMillis
});

const pool = {
    query: (sql,args)=>{
        return util.promisify(sql_pool.query).call(sql_pool,sql, args);
    }
}
export default pool;