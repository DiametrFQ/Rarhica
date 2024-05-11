import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "Rarhica",
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
