require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Configuração do banco de dados
//Substitua pela sua URL de conexão do Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    //Se não usar SSL, adicione ssl: { rejectUnauthorized: false }
    //ssl: { rejectUnauthorized: false }
});

//Teste de conexão com o banco
pool.query('SELECT NOW()')
    .then(() => console.log('✓ Conectado ao banco de dados'))
    .catch(err => console.error('✗ Erro ao conectar:', err.message));

//Criação das tabelas (executar uma vez)
async function criarTabelas() {
    const sql = `
        CREATE TABLE IF NOT EXISTS enquete (
            id SERIAL PRIMARY KEY,
            opcao VARCHAR(100) NOT NULL,
            votos INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS registros_votos (
            id SERIAL PRIMARY KEY,
            ip VARCHAR(50) NOT NULL,
            opcao_escolhida VARCHAR(100) NOT NULL,
            data_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Inserir opções iniciais se não existirem
        INSERT INTO enquete (opcao, votos) 
        SELECT 'Tenho algumas...', 0
        WHERE NOT EXISTS (SELECT 1 FROM enquete WHERE opcao = 'Tenho algumas...');
        
        INSERT INTO enquete (opcao, votos) 
        SELECT 'Entendo tudo 😍', 0
        WHERE NOT EXISTS (SELECT 1 FROM enquete WHERE opcao = 'Entendo tudo 😍');
    `;
    
    try {
        await pool.query(sql);
        console.log('✓ Tabelas criadas com sucesso');
    } catch (err) {
        console.error('Erro ao criar tabelas:', err.message);
    }
}

//Rotas da API

//GET - Ver resultados da enquete
app.get('/api/resultados', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM enquete ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: 'Erro ao buscar resultados' });
    }
});

//POST - Votar
app.post('/api/votar', async (req, res) => {
    const { opcao } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!opcao) {
        return res.status(400).json({ erro: 'Opção inválida' });
    }
    
    //Verificar se o IP já votou hoje (limitar um voto por dia)
    try {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const verificacao = await pool.query(
            'SELECT * FROM registros_votos WHERE ip = $1 AND data_voto >= $2',
            [ip, hoje]
        );
        
        if (verificacao.rows.length > 0) {
            return res.status(403).json({ erro: 'Você já votou hoje!' });
        }
        
        //Inserir o voto
        await pool.query(
            'UPDATE enquete SET votos = votos + 1 WHERE opcao = $1',
            [opcao]
        );
        
        //Registrar o voto
        await pool.query(
            'INSERT INTO registros_votos (ip, opcao_escolhida) VALUES ($1, $2)',
            [ip, opcao]
        );
        
        res.json({ sucesso: true, mensagem: 'Voto registrado!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: 'Erro ao registrar voto' });
    }
});

//Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    criarTabelas();
});
