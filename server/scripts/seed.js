const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seed() {
  try {
    console.log('--- A iniciar Seed ---');
    
    // 1. Limpar dados existentes (A ordem importa por causa das FKs)
    await pool.query('DELETE FROM proposta_keywords');
    await pool.query('DELETE FROM proposta_alunos');
    await pool.query('DELETE FROM proposta_coorientadores');
    await pool.query('DELETE FROM propostas');
    await pool.query('DELETE FROM docentes');
    await pool.query('DELETE FROM alunos');
    await pool.query('DELETE FROM palavras_chave');

    // 2. Criar Docentes com Hash
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash('1234', salt); // Todos terão a pass '1234'

    const doc1 = await pool.query("INSERT INTO docentes (nome, email, password) VALUES ($1, $2, $3) RETURNING id", ['Prof. João Silva', 'joao@uni.pt', passHash]);
    const doc2 = await pool.query("INSERT INTO docentes (nome, email, password) VALUES ($1, $2, $3) RETURNING id", ['Prof. Maria Santos', 'maria@uni.pt', passHash]);
    const doc3 = await pool.query("INSERT INTO docentes (nome, email, password) VALUES ($1, $2, $3) RETURNING id", ['Prof. Pedro Costa', 'pedro@uni.pt', passHash]);
    
    console.log('Docentes criados (Password: 1234)');

    // 3. Criar Alunos
    await pool.query("INSERT INTO alunos (nome, numero_estudante, email) VALUES ('Ana Aluna', '202301', 'ana@aluno.pt')");
    await pool.query("INSERT INTO alunos (nome, numero_estudante, email) VALUES ('Bruno Aluno', '202302', 'bruno@aluno.pt')");
    
    // 4. Criar Keywords
    await pool.query("INSERT INTO palavras_chave (palavra) VALUES ('Web Development'), ('Inteligência Artificial'), ('IoT'), ('Cibersegurança')");

    console.log('--- Seed Concluído com Sucesso ---');
    process.exit(0);
  } catch (err) {
    console.error('Erro no Seed:', err);
    process.exit(1);
  }
}

seed();