DROP TABLE IF EXISTS proposta_keywords;
DROP TABLE IF EXISTS proposta_alunos;
DROP TABLE IF EXISTS proposta_coorientadores;
DROP TABLE IF EXISTS propostas;
DROP TABLE IF EXISTS palavras_chave;
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS docentes;

CREATE TABLE docentes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    numero_estudante VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100)
);

CREATE TABLE palavras_chave (
    id SERIAL PRIMARY KEY,
    palavra VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE propostas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao_objetivos TEXT NOT NULL,
    orientador_id INTEGER REFERENCES docentes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proposta_coorientadores (
    proposta_id INTEGER REFERENCES propostas(id) ON DELETE CASCADE,
    docente_id INTEGER REFERENCES docentes(id) ON DELETE CASCADE,
    PRIMARY KEY (proposta_id, docente_id)
);

CREATE TABLE proposta_alunos (
    proposta_id INTEGER REFERENCES propostas(id) ON DELETE CASCADE,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    PRIMARY KEY (proposta_id, aluno_id)
);

CREATE TABLE proposta_keywords (
    proposta_id INTEGER REFERENCES propostas(id) ON DELETE CASCADE,
    keyword_id INTEGER REFERENCES palavras_chave(id) ON DELETE CASCADE,
    PRIMARY KEY (proposta_id, keyword_id)
);