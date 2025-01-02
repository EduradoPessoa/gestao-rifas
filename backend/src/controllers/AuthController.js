const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/config');

class AuthController {
  async register(req, res) {
    const { name, email, phone, password } = req.body;

    try {
      // Verificar se o email já existe
      const existingUser = await db.getAsync(
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
      const result = await db.runAsync(
        `INSERT INTO users (name, email, phone, password) 
         VALUES (?, ?, ?, ?)`,
        [name, email, phone, hashedPassword]
      );

      // Gerar token
      const token = jwt.sign(
        { id: result.lastID },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: result.lastID,
          name,
          email,
          phone,
          role: 'user'
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    console.log('Tentativa de login:', { email });

    try {
      // Buscar usuário
      console.log('Buscando usuário no banco...');
      const user = await db.getAsync(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      console.log('Usuário encontrado:', user);

      if (!user) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verificar senha
      console.log('Verificando senha...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Senha válida:', isValidPassword);

      if (!isValidPassword) {
        console.log('Senha inválida');
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gerar token
      console.log('Gerando token...');
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      console.log('Login bem-sucedido');
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
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
      const user = await db.getAsync(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Aqui você implementaria a lógica de envio de e-mail
      // Por enquanto, apenas simulamos o sucesso
      res.json({ message: 'E-mail de recuperação enviado' });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      res.status(500).json({ message: 'Erro ao processar recuperação de senha' });
    }
  }

  async resetPassword(req, res) {
    const { token, password } = req.body;

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Hash da nova senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Atualizar senha
      await db.runAsync(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, decoded.id]
      );

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      res.status(500).json({ message: 'Erro ao redefinir senha' });
    }
  }
}

module.exports = new AuthController();
