const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar se user existe
        const result = await pool.query('SELECT * FROM docentes WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const user = result.rows[0];

        // 2. Comparar password (hash)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Gerar Token
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({ 
            token, 
            user: { id: user.id, nome: user.nome, email: user.email } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
};

exports.register = async (req, res) => {
    const { nome, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        await pool.query('INSERT INTO docentes (nome, email, password) VALUES ($1, $2, $3)', [nome, email, hash]);
        res.status(201).json({ message: 'Docente registado com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};