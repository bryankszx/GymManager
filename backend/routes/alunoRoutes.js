const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// Middleware simples de autenticação
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    // Em produção, verificar token JWT válido
    // Por enquanto, extrair usuário do token simples
    if (token === 'token-simples-demo') {
      req.usuario = { usuario: 'admin', nome: 'Administrador' };
    }
  }
  
  next();
}

// Aplicar middleware em todas as rotas
router.use(authMiddleware);

router.post('/', alunoController.criarAluno);
router.get('/', alunoController.listarAlunos);
router.get('/estatisticas', alunoController.getEstatisticas);
router.get('/:id', alunoController.buscarAluno);
router.put('/:id', alunoController.atualizarAluno);
router.delete('/:id', alunoController.deletarAluno);

module.exports = router;
