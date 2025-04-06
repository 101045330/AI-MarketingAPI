const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'YOUR_DB_HOST',
    user: 'YOUR_DB_USER',
    password: 'YOUR_DB_PASSWORD',
    database: 'YOUR_DB_NAME',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function callProcedure(procedureName, params = []) {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(`CALL <span class="math-inline">\{procedureName\}\(</span>{params.map(() => '?').join(',')})`, params);
        connection.release();
        return results[0];
    } catch (error) {
        console.error(`Error calling ${procedureName}:`, error);
        throw error;
    }
}

//  1. Get Countries
app.get('/countries', async (req, res) => {
    try {
        const countries = await callProcedure('sp_get_countries');
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  2. Get Cities by Country
app.get('/countries/:countryId/cities', async (req, res) => {
    try {
        const { countryId } = req.params;
        const cities = await callProcedure('sp_get_cities_by_country', [parseInt(countryId)]);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  3. Get Institutions by City
app.get('/cities/:cityId/institutions', async (req, res) => {
    try {
        const { cityId } = req.params;
        const institutions = await callProcedure('sp_get_institutions_by_city', [parseInt(cityId)]);
        res.json(institutions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  4. Get Faculties by Institution
app.get('/institutions/:institutionId/faculties', async (req, res) => {
    try {
        const { institutionId } = req.params;
        const faculties = await callProcedure('sp_get_faculties_by_institution', [parseInt(institutionId)]);
        res.json(faculties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  5. Get Programs by Faculty
app.get('/faculties/:facultyId/programs', async (req, res) => {
    try {
        const { facultyId } = req.params;
        const programs = await callProcedure('sp_get_programs_by_faculty', [parseInt(facultyId)]);
        res.json(programs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  6. Get Reviews by Program
app.get('/programs/:programId/reviews', async (req, res) => {
    try {
        const { programId } = req.params;
        const reviews = await callProcedure('sp_get_reviews_by_program', [parseInt(programId)]);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
