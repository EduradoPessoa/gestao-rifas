const db = require('../database');

class RaffleController {
  async index(req, res) {
    try {
      const raffles = await db.all(`
        SELECT 
          r.*,
          p.name as product_name,
          p.description as product_description,
          p.image_url,
          COUNT(q.id) as sold_quotes
        FROM raffles r
        JOIN products p ON r.product_id = p.id
        LEFT JOIN quotes q ON r.id = q.raffle_id AND q.payment_status = 'paid'
        GROUP BY r.id
        ORDER BY r.created_at DESC
      `);

      res.json(raffles);
    } catch (error) {
      console.error('Erro ao listar rifas:', error);
      res.status(500).json({ message: 'Erro ao buscar rifas' });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const raffle = await db.get(`
        SELECT 
          r.*,
          p.name as product_name,
          p.description as product_description,
          p.image_url
        FROM raffles r
        JOIN products p ON r.product_id = p.id
        WHERE r.id = ?
      `, [id]);

      if (!raffle) {
        return res.status(404).json({ message: 'Rifa não encontrada' });
      }

      // Buscar números vendidos
      const soldQuotes = await db.all(`
        SELECT quote_number
        FROM quotes
        WHERE raffle_id = ? AND payment_status = 'paid'
      `, [id]);

      raffle.sold_quotes = soldQuotes.map(q => q.quote_number);

      res.json(raffle);
    } catch (error) {
      console.error('Erro ao buscar rifa:', error);
      res.status(500).json({ message: 'Erro ao buscar detalhes da rifa' });
    }
  }

  async create(req, res) {
    const {
      product_id,
      total_quotes,
      quote_price,
      draw_date
    } = req.body;

    try {
      const result = await db.run(`
        INSERT INTO raffles (
          product_id,
          total_quotes,
          quote_price,
          draw_date,
          status
        ) VALUES (?, ?, ?, ?, 'draft')
      `, [product_id, total_quotes, quote_price, draw_date]);

      const raffle = await db.get(
        'SELECT * FROM raffles WHERE id = ?',
        [result.lastID]
      );

      res.status(201).json(raffle);
    } catch (error) {
      console.error('Erro ao criar rifa:', error);
      res.status(500).json({ message: 'Erro ao criar rifa' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      total_quotes,
      quote_price,
      draw_date,
      status
    } = req.body;

    try {
      await db.run(`
        UPDATE raffles
        SET total_quotes = ?,
            quote_price = ?,
            draw_date = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [total_quotes, quote_price, draw_date, status, id]);

      const raffle = await db.get(
        'SELECT * FROM raffles WHERE id = ?',
        [id]
      );

      res.json(raffle);
    } catch (error) {
      console.error('Erro ao atualizar rifa:', error);
      res.status(500).json({ message: 'Erro ao atualizar rifa' });
    }
  }

  async buyQuotes(req, res) {
    const { raffle_id } = req.params;
    const { quotes } = req.body;
    const user_id = req.user.id; // Vem do middleware de autenticação

    try {
      // Verificar se os números estão disponíveis
      const soldQuotes = await db.all(`
        SELECT quote_number
        FROM quotes
        WHERE raffle_id = ? AND quote_number IN (${quotes.join(',')})
      `, [raffle_id]);

      if (soldQuotes.length > 0) {
        return res.status(400).json({
          message: 'Alguns números já foram vendidos',
          unavailable_quotes: soldQuotes.map(q => q.quote_number)
        });
      }

      // Inserir reservas
      const values = quotes.map(quote_number => 
        `(${raffle_id}, ${quote_number}, ${user_id}, 'pending')`
      ).join(',');

      await db.run(`
        INSERT INTO quotes (raffle_id, quote_number, user_id, payment_status)
        VALUES ${values}
      `);

      res.status(201).json({ message: 'Números reservados com sucesso' });
    } catch (error) {
      console.error('Erro ao comprar números:', error);
      res.status(500).json({ message: 'Erro ao processar compra' });
    }
  }

  async performDraw(req, res) {
    const { id } = req.params;

    try {
      // Buscar números vendidos
      const soldQuotes = await db.all(`
        SELECT quote_number
        FROM quotes
        WHERE raffle_id = ? AND payment_status = 'paid'
      `, [id]);

      if (soldQuotes.length === 0) {
        return res.status(400).json({ message: 'Nenhum número vendido' });
      }

      // Sortear número aleatório
      const winningQuote = soldQuotes[Math.floor(Math.random() * soldQuotes.length)];

      // Atualizar rifa
      await db.run(`
        UPDATE raffles
        SET status = 'completed',
            winner_quote_number = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [winningQuote.quote_number, id]);

      // Buscar dados do ganhador
      const winner = await db.get(`
        SELECT u.name, u.email, u.phone
        FROM quotes q
        JOIN users u ON q.user_id = u.id
        WHERE q.raffle_id = ? AND q.quote_number = ?
      `, [id, winningQuote.quote_number]);

      res.json({
        winning_quote: winningQuote.quote_number,
        winner
      });
    } catch (error) {
      console.error('Erro ao realizar sorteio:', error);
      res.status(500).json({ message: 'Erro ao realizar sorteio' });
    }
  }
}

module.exports = new RaffleController();
