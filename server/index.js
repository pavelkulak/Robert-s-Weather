'use strict';

import express from "express";
import fetch from "node-fetch";
import cors from "cors"

const app = express();
app.use(cors()); // Разрешаем CORS

const PORT = 3000;

app.get("/geonames", async (req, res) => {
    const city = req.query.city;
    const lang = req.query.lang || "en";
    const username = "robertimor"; 

    const url = `http://api.geonames.org/searchJSON?q=${city}&lang=${lang}&maxRows=1&username=${username}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Ошибка запроса к Geonames" });
    }
});

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));