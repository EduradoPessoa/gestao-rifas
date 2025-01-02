const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./config');

async function resetDatabase() {
    try {
        // Remover banco de dados existente
        const dbPath = path.resolve(__dirname, 'database.sqlite');
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log('Banco de dados existente removido');
        }

        // Criar tabelas
        await db.runAsync(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log('Tabela users criada');

        // Criar usuário admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await db.runAsync(
            `INSERT INTO users (name, email, phone, password, role) 
             VALUES (?, ?, ?, ?, ?)`,
            ['Administrador', 'admin@example.com', '(11) 99999-9999', hashedPassword, 'admin']
        );
        console.log('Usuário admin criado');

        console.log('Banco de dados reinicializado com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao reinicializar banco de dados:', error);
        process.exit(1);
    }
}

resetDatabase();
