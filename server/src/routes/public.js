const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/docentes', publicController.getDocentes);

module.exports = router;