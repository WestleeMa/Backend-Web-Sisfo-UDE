const db = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "db_sisfo_ude",
  },
});
module.exports = db;
