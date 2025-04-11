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

// Spit out data

app.get('/', (request, response) => {
    response.json(
        {
            info: 'Backend for GBC Library, set up by Chris K!'
        }
    )
})

/*
app.get('/v1/webusers/register', (request, response) => {
    response.json(
        {
            info: 'Registration are closed until dooms day: 2099 dev 31 23:59 hours GMT'
        }
    )
});
*/
//NOTE: disable new registration by uncommenting above block and commenting block below

// /v1/webusers/register

app.post("/v1/webusers/register", (request, response) => {
    const full_name = request.body.full_name;
    const email = request.body.email;
    const password = md5(request.body.password); 
    const api_key_secret = md5(rand(10001, 99999999999));
    const api_key = md5(full_name + email + api_key_secret); // Removed concat()

    const is_active = 0;

    const currentDate = new Date();
    const api_key_issued_date = currentDate.toISOString().split('T')[0];

    const expiryDateObj = new Date(currentDate);
    expiryDateObj.setDate(expiryDateObj.getDate() + 30);
    const api_key_expiry_date = expiryDateObj.toISOString().split('T')[0];

    pool.query(
        "INSERT INTO Web_Users (full_name, email, is_active, password, api_key, api_key_secret, api_key_issued_date, api_key_expiry_date) VALUES (?,?,?,?,?,?,?,?)",
        [full_name, email, is_active, password, api_key, api_key_secret, api_key_issued_date, api_key_expiry_date],
        (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ status: "error", message: error.message });
            }
            response.json({
                status: "success",
                message: "New user added as registration is still open"
            });
        }
    );
});


app.post('/v1/webusers/register1111', (req, res) => {
    const { full_name, email, password } = req.body;
    // Implement your registration logic here
   // res.status(201).json({ message: 'User registered successfully' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


app.get("/v1/users/list", (request, response) => {

    pool.query("SELECT fname, lname, email FROM users ORDER BY id", [], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });

})

//marketing // country //list

app.get("/v1/countries/list", (request, response) => {

    pool.query("SELECT * FROM Countries ORDER BY name ASC", [], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });

})

//marketing //cities //list by country_id
app.get("/v1/cities/get", (request, response) => {

    const id = request.query.id;

    pool.query("SELECT id, name, country_id FROM Cities WHERE country_id = ? ORDER BY name ASC", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
})

//marketing //instutions //list instutions by city_id
app.get("/v1/instutions/get", (request, response) => {

    const id = request.query.id;

    pool.query("SELECT id, name, city_id FROM Institutions WHERE city_id = ?  and is_active =1 ORDER BY name ASC", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
}) 

//marketing //faculties //list faculties by institution_id
app.get("/v1/faculties/get", (request, response) => {

    const id = request.query.id;

    pool.query("SELECT id, name, institution_id FROM Faculties WHERE institution_id = ? and is_active = 1 ORDER BY name ASC", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
});

//marketing //programs //list programs by faculty_id
app.get("/v1/programs/get", (request, response) => {

    const id = request.query.id;

    pool.query("SELECT id, name, faculty_id FROM Programs WHERE faculty_id = ? and is_active =1 ORDER BY name ASC", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
});

//marketing //participant //get list of 25 fresh reviews that contains review, rating, nick_name of participant, and date but sotted by id desc
app.get("/v1/programreviews/get", (request, response) => {

    const id = request.query.id;
/*SELECT  pr.id, pr.review,     pr.rating,     pr.created_date,     pr.program_id,     COALESCE(p.alias_if_any, p.name) AS participant_name FROM ProgramReviews pr JOIN  Participants p ON pr.participant_id = p.id WHERE   pr.program_id = 1 ORDER BY  pr.id DESC LIMIT 2; */
    pool.query("SELECT  pr.id,pr.review,pr.rating,pr.created_date,pr.program_id,COALESCE(p.alias_if_any, p.name) AS participant_name FROM ProgramReviews pr JOIN  Participants p ON pr.participant_id = p.id WHERE   pr.program_id = ? ORDER BY  pr.id DESC LIMIT 25", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
});

//marketing //reviews //list top 10 reviews by participants who joined the program 
app.get("/v1/reviews/get", (request, response) => {

    const id = request.query.id;

    pool.query("SELECT id, name, program_id, participant_id FROM ProgramReviews WHERE faculty_id = ? ORDER BY name ASC", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
});



///v1/cities/get

app.get("/v1/users/get", (request, response) => {

    const id = request.query.id;

    pool.query("SELECT fname, lname, email FROM users WHERE id = ?", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
})
app.get("/v1/users/get", (request, response) => {

    const id = request.query.id;

    pool.query("SELECT fname, lname, email FROM users WHERE id = ?", [id], (error, result) => {
        response.json(
            {
                status: "success",
                data: result
            }
        )
    });
})

app.post("/v1/users/create", (request, response) => {

    const fname = request.body.fname;
    const lname = request.body.lname;
    const email = request.body.email;

    pool.query(
        "INSERT INTO users (fname, lname, email) VALUES (?, ?, ?)",
        [fname, lname, email], (error, result) => {
            response.json(
                {
                    status: "success",
                    message: "New user created"
                }
            )
        }

    )

})





// /v1/webusers/register

app.post("/v1/users/remove", (request, response) => {

    const id = request.body.id;

    pool.query(
        "UPDATE users SET removed = 1 WHERE id = ?",
        [id], (error, result) => {
            response.json(
                {
                    status: "success",
                    message: "User removed"
                }
            )
        }

    )

})