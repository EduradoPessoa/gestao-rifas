const jwt = require('jsonwebtoken');
const db = require('../database');

module.exports = async (req, res, next) => {
  try {
    // Verificar header de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Extrair token
    const [, token] = authHeader.split(' ');

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário
      const user = await db.get(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [decoded.id]
      );

      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Adicionar usuário à requisição
      req.user = user;

      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
