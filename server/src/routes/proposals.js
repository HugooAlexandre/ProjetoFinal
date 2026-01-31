const express = require('express');
const router = express.Router();
const controller = require('../controllers/proposalController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protege todas as rotas abaixo

router.get('/', controller.getMyProposals);
router.get('/aux', controller.getAuxData);
router.post('/', controller.createProposal);
router.delete('/:id', controller.deleteProposal);

module.exports = router;