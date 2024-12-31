const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

class AuthController {
  async register(req, res) {
    const { name, email, phone, password } = req.body;

    try {
      // Verificar se o email já existe
      const [existingUser] = await db.get(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser) {
        return res.status(400).json({ message: 'E-mail já cadastrado' });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Inserir usuário
      const result = await db.run(
        `INSERT INTO users (name, email, phone, password) 
         VALUES (?, ?, ?, ?)`,
        [name, email, phone, hashedPassword]
      );

      // Gerar token
      const token = jwt.sign(
        { id: result.lastID },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      res.status(201).json({
        token,
        user: {
          id: result.lastID,
          name,
          email,
          phone
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Buscar usuário
      const user = await db.get(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await db.get(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Gerar token de reset
      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Aqui você implementaria o envio do email
      // Por enquanto, apenas retornamos sucesso
      res.json({ message: 'E-mail de recuperação enviado' });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
  }

  async resetPassword(req, res) {
    const { token, password } = req.body;

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Hash da nova senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Atualizar senha
      await db.run(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, decoded.id]
      );

      res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      res.status(400).json({ message: 'Token inválido ou expirado' });
    }
  }
}

module.exports = new AuthController();
