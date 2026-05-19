const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./enquete.db', (err) => {
    if (err) {
        console.error('Erro ao abrir banco', err.message);
    } else {
        console.log('Banco conectado com sucesso.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS votos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            voto TEXT NOT NULL,
            data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;