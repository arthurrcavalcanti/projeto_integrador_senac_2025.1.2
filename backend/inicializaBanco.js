const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbFile = './dev.sqlite3';
const schemaFile = './schema.db'; // ou schema.sql

// Cria as tabelas se ainda não existirem
const initDatabase = () => {
  const db = new sqlite3.Database(dbFile);
  const schema = fs.readFileSync(schemaFile, 'utf8');
  db.exec(schema, (err) => {
    if (err) {
      console.error('Erro ao aplicar o schema:', err.message);
    } else {
      console.log('📦 Banco de dados inicializado com sucesso!');
    }
    db.close();
  });
};

initDatabase(); // Chamada na inicialização