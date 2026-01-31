const pool = require('../config/db');

// Obter dados auxiliares para o formulário
exports.getAuxData = async (req, res) => {
    try {
        const alunos = await pool.query('SELECT id, nome, numero_estudante FROM alunos ORDER BY nome');
        // Excluir o próprio docente da lista de coorientadores possíveis
        const docentes = await pool.query('SELECT id, nome FROM docentes WHERE id != $1 ORDER BY nome', [req.user.id]);
        const keywords = await pool.query('SELECT * FROM palavras_chave ORDER BY palavra');
        
        res.json({ alunos: alunos.rows, docentes: docentes.rows, keywords: keywords.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar propostas do docente autenticado
exports.getMyProposals = async (req, res) => {
    try {
        const query = `
            SELECT p.*,
                COALESCE((
                    SELECT json_agg(json_build_object('id', d.id, 'nome', d.nome))
                    FROM proposta_coorientadores pc
                    JOIN docentes d ON pc.docente_id = d.id
                    WHERE pc.proposta_id = p.id
                ), '[]') AS coorientadores,
                COALESCE((
                    SELECT json_agg(json_build_object('id', a.id, 'nome', a.nome))
                    FROM proposta_alunos pa
                    JOIN alunos a ON pa.aluno_id = a.id
                    WHERE pa.proposta_id = p.id
                ), '[]') AS alunos,
                COALESCE((
                    SELECT json_agg(json_build_object('id', k.id, 'palavra', k.palavra))
                    FROM proposta_keywords pk
                    JOIN palavras_chave k ON pk.keyword_id = k.id
                    WHERE pk.proposta_id = p.id
                ), '[]') AS keywords
            FROM propostas p
            WHERE p.orientador_id = $1
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Criar Proposta com Transação
exports.createProposal = async (req, res) => {
    const { titulo, descricao, coorientadoresIds, alunosIds, keywordsIds } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar Transação

        // 1. Inserir Proposta
        const insertProp = 'INSERT INTO propostas (titulo, descricao_objetivos, orientador_id) VALUES ($1, $2, $3) RETURNING id';
        const resProp = await client.query(insertProp, [titulo, descricao, req.user.id]);
        const propId = resProp.rows[0].id;

        // 2. Inserir Coorientadores
        if (coorientadoresIds && coorientadoresIds.length > 0) {
            for (const docId of coorientadoresIds) {
                await client.query('INSERT INTO proposta_coorientadores (proposta_id, docente_id) VALUES ($1, $2)', [propId, docId]);
            }
        }

        // 3. Inserir Alunos
        if (alunosIds && alunosIds.length > 0) {
            for (const alunoId of alunosIds) {
                await client.query('INSERT INTO proposta_alunos (proposta_id, aluno_id) VALUES ($1, $2)', [propId, alunoId]);
            }
        }

        // 4. Inserir Keywords
        if (keywordsIds && keywordsIds.length > 0) {
            for (const kId of keywordsIds) {
                await client.query('INSERT INTO proposta_keywords (proposta_id, keyword_id) VALUES ($1, $2)', [propId, kId]);
            }
        }

        await client.query('COMMIT'); // Confirmar Transação
        res.status(201).json({ message: 'Proposta criada com sucesso', id: propId });

    } catch (err) {
        await client.query('ROLLBACK'); // Reverter em caso de erro
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar proposta. Transação revertida.' });
    } finally {
        client.release();
    }
};

exports.deleteProposal = async (req, res) => {
    const propId = req.params.id;
    try {
        const check = await pool.query('SELECT * FROM propostas WHERE id = $1 AND orientador_id = $2', [propId, req.user.id]);
        if (check.rows.length === 0) return res.status(403).json({ message: 'Não autorizado ou proposta não encontrada' });

        await pool.query('DELETE FROM propostas WHERE id = $1', [propId]);
        res.json({ message: 'Proposta apagada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};