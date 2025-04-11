// Get the client
const mysql = require('mysql2');
require('dotenv').config()

// ATTENTION REQUIRED: Create the connection to database

const pool = mysql.createPool({
    host: process.env.SQL_HOSTNAME,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DBNAME,
});

// Set up the API
const express = require('express')
var cors = require('cors');
const bodyParser = require('body-parser')
const app = express()
const port = 3001

// Make it available for public access

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use(cors());
app.options("*", cors());

app.set('json spaces', 2)
app.use(bodyParser.json({
    limit: "50mb"
}))
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

// Listen to outside connection

app.listen(port, () => {
    console.log(`App running on port ${port}. Control+C to exit.`)
})

// Default route
app.get('/', (request, response) => {
    response.json({
        info: 'registration info here, if not closed until 2099 Dec 31'
    });
});

// 1. List of Active Countries
app.get("/v1/countries/list-active", (request, response) => {
    pool.query("CALL ListActiveCountries()", (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).json({ status: "error", message: "Internal Server Error" });
            return;
        }
        response.json({ status: "success", data: result[0] });
    });
});

// 2. List of Active Cities Based on Country ID
app.get("/v1/cities/list-active", (request, response) => {
    const countryId = request.query.countryId;
    if (!countryId) {
        return response.status(400).json({ status: "error", message: "Missing countryId parameter" });
    }
    pool.query("CALL ListActiveCitiesByCountry(?)", [countryId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).json({ status: "error", message: "Internal Server Error" });
            return;
        }
        response.json({ status: "success", data: result[0] });
    });
});

// 3. List of Active Institutions Based on Selected City

app.get("/v1/instutions/list-active", (request, response) => {
    const cityId = request.query.cityId;
    if (!cityId) {
        return response.status(400).json({ status: "error", message: "Missing countryId parameter" });
    }
    pool.query("CALL ListActiveCitiesByCountry(?)", [cityId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).json({ status: "error", message: "Internal Server Error" });
            return;
        }
        response.json({ status: "success", data: result[0] });
    });
});

// 4. List of Active Faculties Based on Selected Instutions

app.get("/v1/faculties/list-active", (request, response) => {
    const institutionId = request.query.institutionId;
    if (!institutionId) {
        return response.status(400).json({ status: "error", message: "Missing countryId parameter" });
    }
    pool.query("CALL ListActiveCitiesByCountry(?)", [institutionId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).json({ status: "error", message: "Internal Server Error" });
            return;
        }
        response.json({ status: "success", data: result[0] });
    });
});


// 5. List of Active Programs Based on Selected Faculties

app.get("/v1/programs/list-active", (request, response) => {
    const facultyId = request.query.facultyId;
    if (!facultyId) {
        return response.status(400).json({ status: "error", message: "Missing countryId parameter" });
    }
    pool.query("CALL ListActiveCitiesByCountry(?)", [facultyId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).json({ status: "error", message: "Internal Server Error" });
            return;
        }
        response.json({ status: "success", data: result[0] });
    });
});


// 6. List of Active Programs Based on Selected Faculties

app.get("/v1/programs/list-active", (request, response) => {
    const facultyId = request.query.facultyId;
    if (!facultyId) {
        return response.status(400).json({ status: "error", message: "Missing countryId parameter" });
    }
    pool.query("CALL ListActiveCitiesByCountry(?)", [facultyId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).json({ status: "error", message: "Internal Server Error" });
            return;
        }
        response.json({ status: "success", data: result[0] });
    });
});
s