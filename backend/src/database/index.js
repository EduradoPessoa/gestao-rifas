const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../database/database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    initializeDatabase();
  }
});

function initializeDatabase() {
  const schema = require('../../../database/schema.sql').toString();
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('Erro ao inicializar banco de dados:', err.message);
    } else {
      console.log('Banco de dados inicializado com sucesso');
    }
  });
}

module.exports = db;
