const mysql = require('mysql');

const connection = mysql.createConnection({
  host       : "localhost",
  port       : 3306,
  user       : "root",
  password   : "root",
  database   : "grabbd"
});

connection.connect(function(err, resp) {
  if (err) throw err;
});

module.exports = connection;