const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const RaffleController = require('../controllers/RaffleController');
const authMiddleware = require('../middleware/auth');

// Rotas públicas
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPassword);

// Rotas de rifas públicas
router.get('/raffles', RaffleController.index);
router.get('/raffles/:id', RaffleController.show);

// Rotas protegidas
router.use(authMiddleware);

// Rotas de rifas protegidas
router.post('/raffles', RaffleController.create);
router.put('/raffles/:id', RaffleController.update);
router.post('/raffles/:raffle_id/buy', RaffleController.buyQuotes);
router.post('/raffles/:id/draw', RaffleController.performDraw);

module.exports = router;
