const db = require('../database/config');
const bcrypt = require('bcryptjs');

class User {
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async create(userData) {
        const { name, email, password, role = 'user' } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role],
                function(err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID, name, email, role });
                }
            );
        });
    }

    static async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;
