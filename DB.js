import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

/**
 * @param {string} sql
 * @param {string[]} arg
 * @returns {Promise<any[]>}
 */
const query = (sql, arg = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, arg, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export default query;
