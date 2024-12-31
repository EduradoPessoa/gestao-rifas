require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Injetar io no req para uso nos controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas
app.use('/api', routes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join-raffle', (raffleId) => {
    socket.join(`raffle-${raffleId}`);
    console.log(`Cliente ${socket.id} entrou na sala da rifa ${raffleId}`);
  });

  socket.on('leave-raffle', (raffleId) => {
    socket.leave(`raffle-${raffleId}`);
    console.log(`Cliente ${socket.id} saiu da sala da rifa ${raffleId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
