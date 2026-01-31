const pool = require('../config/db');

exports.getDocentes = async (req, res) => {
    try {
        // Seleciona apenas dados não sensíveis (sem password)
        const query = 'SELECT id, nome, email FROM docentes ORDER BY nome ASC';
        const result = await pool.query(query);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar docentes públicos:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};