require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// SQL bağlantı ayarları (Artık .env'den geliyor)
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

// HTTPS sertifika ayarları
const options = {
    pfx: fs.readFileSync("./cert.pfx"),
    passphrase: process.env.CERTIFICATE_PASSWORD
};

// PORT seçimi (Render için gerekli)
const PORT = process.env.PORT || 5000;

// HTTPS server başlatılıyor
https.createServer(options, app).listen(PORT, "0.0.0.0", () => {
    console.log(`💚 HTTPS Backend ÇALIŞIYOR 👉 https://10.110.110.97:${PORT}`);
});
