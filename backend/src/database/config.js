const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Criar conexão com o banco de dados
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        initializeDatabase();
    }
});

// Promisify db.run e db.get
db.runAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

db.getAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Função para inicializar o banco de dados com as tabelas necessárias
async function initializeDatabase() {
    try {
        // Criar tabela de usuários
        await db.runAsync(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Criar tabela de rifas
        await db.runAsync(`CREATE TABLE IF NOT EXISTS raffles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            total_numbers INTEGER NOT NULL,
            draw_date DATETIME NOT NULL,
            image_url TEXT,
            status TEXT DEFAULT 'draft',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Criar usuário admin padrão se não existir
        const adminUser = await db.getAsync("SELECT id FROM users WHERE email = 'admin@example.com'");
        
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.runAsync(
                `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
                ['Admin', 'admin@example.com', hashedPassword, 'admin']
            );
            console.log('Usuário admin criado com sucesso');
        }
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
    }
}

module.exports = db;
