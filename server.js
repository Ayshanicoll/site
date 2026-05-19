const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/votar', (req, res) => {
    const { voto } = req.body;

    if (!['sim', 'nao'].includes(voto)) {
        return res.status(400).send('Voto inválido');
    }

    const query = `INSERT INTO votos (voto) VALUES (?)`;

    db.run(query, [voto], function (err) {
        if (err) {
            return res.status(500).send('Erro ao salvar voto');
        }
        res.status(200).send('Voto computado');
    });
});

app.get('/resultados', (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN voto = 'sim' THEN 1 ELSE 0 END) as sim,
            SUM(CASE WHEN voto = 'nao' THEN 1 ELSE 0 END) as nao
        FROM votos
    `;

    db.get(query, [], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao buscar resultados');
        }

        res.json({
            sim: row.sim || 0,
            nao: row.nao || 0
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});