const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

const CUSTOM_OBJECT_TYPE_ID = '2-145042922';

// ===============================================
// ROUTE 1: Homepage (GET '/')
// ===============================================
app.get('/', async (req, res) => {
    // Define the endpoint for listing records of your custom object
    const getRecordsEndpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE_ID}`;

    // Define headers for the API request
    const headers = {
        'Authorization': `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    // Define the properties you want to retrieve from your custom object
    // These are the new properties: name, publisher, price
    const propertiesToGet = 'name,publisher,price';

    try {
        // Make a GET request to the HubSpot API to fetch the records
        const response = await axios.get(getRecordsEndpoint, {
            headers,
            params: {
                properties: propertiesToGet
            }
        });
        // Extract the records from the response data
        const records = response.data.results;
        
        // Render the homepage template and pass the records data to it
        res.render('homepage', { 
            title: 'Custom Objects Table | Integrating With HubSpot I Practicum',
            records 
        });

    } catch (error) {
        console.error(error);
        // It's good practice to handle errors and show a user-friendly message
        res.status(500).send('Error fetching data from HubSpot. Check your console.');
    }
});

// ===============================================
// ROUTE 2: Form Page (GET '/update-cobj')
// ===============================================
app.get('/update-cobj', (req, res) => {
    // This route simply renders the pug template with the form.
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ===============================================
// ROUTE 3: Handle Form Submission (POST '/update-cobj')
// ===============================================
app.post('/update-cobj', async (req, res) => {
    // Construct the new record's properties from the form data in req.body
    // Updated to use name, publisher, and price
    const newRecord = {
        properties: {
            "name": req.body.name,
            "publisher": req.body.publisher,
            "price": req.body.price
        }
    };

    // Define the endpoint for creating a new record
    const createRecordEndpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE_ID}`;
    const headers = {
        'Authorization': `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        // Make a POST request to create the new record in HubSpot
        await axios.post(createRecordEndpoint, newRecord, { headers });
        // After successfully creating the record, redirect the user back to the homepage
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating a new record in HubSpot. Check your console.');
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
