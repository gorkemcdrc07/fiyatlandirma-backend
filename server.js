require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// SQL bağlantı ayarları (.env üzerinden geliyor)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Müşteri listesini dönen endpoint
app.get("/api/musteriler", async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM Musteri");
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Render'ın verdiği PORT'u kullan
const PORT = process.env.PORT || 5000;

// Sadece HTTP olarak başlat (Render otomatik HTTPS yapar)
app.listen(PORT, () => {
    console.log(`🚀 Backend çalışıyor (Render) - PORT: ${PORT}`);
});
