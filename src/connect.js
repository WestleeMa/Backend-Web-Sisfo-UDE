const db = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    port: "3308",
    password: "",
    database: "db_sisfo_ude",
  },
});
module.exports = db;
