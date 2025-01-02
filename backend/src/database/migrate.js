const fs = require('fs');
const path = require('path');
const db = require('./config');

async function runMigrations() {
  try {
    const migrationsPath = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`Executando migração: ${file}`);
      const migration = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
      await db.runAsync(migration);
    }

    console.log('Migrações executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
    process.exit(1);
  }
}

runMigrations();
