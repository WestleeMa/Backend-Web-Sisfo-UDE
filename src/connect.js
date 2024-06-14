const db = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    port: "3306",
    password: "",
    database: "db_sisfo_ude",
  },
});
module.exports = db;
