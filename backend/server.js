const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors());
app.use(express.json());

// --- Banco de Dados ---
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error('Erro ao conectar ao SQLite:', err.message);
    else console.log('Conectado ao banco de dados SQLite.');
});

// Criação das tabelas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT,
        year INTEGER,
        plate TEXT,
        mileage INTEGER
    )`);

    // NOVA TABELA DE REVISÕES: Agora com a coluna "cost" (custo em número real)
    db.run(`CREATE TABLE IF NOT EXISTS maintenances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        type TEXT,
        date TEXT,
        description TEXT,
        cost REAL, 
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
    )`);
});

// --- Rotas de Veículos ---
app.post('/api/vehicles', (req, res) => {
    const { model, year, plate, mileage } = req.body;
    const sql = `INSERT INTO vehicles (model, year, plate, mileage) VALUES (?, ?, ?, ?)`;
    db.run(sql, [model, year, plate, mileage], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, model, year, plate, mileage });
    });
});

app.get('/api/vehicles', (req, res) => {
    const sql = `
        SELECT vehicles.*, COUNT(maintenances.id) AS maintenanceCount 
        FROM vehicles 
        LEFT JOIN maintenances ON vehicles.id = maintenances.vehicle_id 
        GROUP BY vehicles.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/vehicles/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM maintenances WHERE vehicle_id = ?`, [id], (err) => {
        if (err) return res.status(400).json({ error: err.message });
        db.run(`DELETE FROM vehicles WHERE id = ?`, [id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Veículo excluído com sucesso!" });
        });
    });
});

// --- Rotas de Manutenções ---
// AGORA RECEBE O COST (CUSTO)
app.post('/api/maintenances', (req, res) => {
    const { vehicle_id, type, date, description, cost } = req.body;
    const sql = `INSERT INTO maintenances (vehicle_id, type, date, description, cost) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [vehicle_id, type, date, description, cost], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, vehicle_id, type, date, description, cost });
    });
});

app.get('/api/maintenances/:vehicle_id', (req, res) => {
    const { vehicle_id } = req.params;
    const sql = `SELECT * FROM maintenances WHERE vehicle_id = ? ORDER BY date DESC`;
    db.all(sql, [vehicle_id], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// Rota para deletar uma manutenção específica
app.delete('/api/maintenances/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM maintenances WHERE id = ?`, [id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Revisão excluída com sucesso!" });
    });
});

// Rota para editar uma manutenção específica
app.put('/api/maintenances/:id', (req, res) => {
    const { id } = req.params;
    const { type, date, description, cost } = req.body;
    
    const sql = `UPDATE maintenances SET type = ?, date = ?, description = ?, cost = ? WHERE id = ?`;
    
    db.run(sql, [type, date, description, cost, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Revisão atualizada com sucesso!" });
    });
});

// --- Rota do Dashboard ---
app.get('/api/dashboard', (req, res) => {
    // 1. Conta os veículos
    db.get("SELECT COUNT(*) AS totalVehicles FROM vehicles", [], (err, rowVehicles) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // 2. Conta as revisões e soma o custo total (Faturamento)
        db.get("SELECT COUNT(*) AS totalMaintenances, SUM(cost) AS totalRevenue FROM maintenances", [], (err, rowMaintenances) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // 3. Busca a quantidade de revisões separada por tipo (para o gráfico)
            db.all("SELECT type AS name, COUNT(*) AS value FROM maintenances GROUP BY type", [], (err, rowsChart) => {
                if (err) return res.status(500).json({ error: err.message });
                
                res.json({
                    totalVehicles: rowVehicles.totalVehicles,
                    totalMaintenances: rowMaintenances.totalMaintenances,
                    totalRevenue: rowMaintenances.totalRevenue || 0, // Se for null, vira 0
                    chartData: rowsChart // Os dados prontos para o gráfico
                });
            });
        });
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));