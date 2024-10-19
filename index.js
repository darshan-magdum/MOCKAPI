const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// In-memory customer records
let customers = [];
let currentId = 1;

// POST endpoint to add a customer record
app.post('/customers', (req, res) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const customer = {
        id: currentId++,
        name,
        email,
        phone
    };

    customers.push(customer);
    res.status(201).json(customer);
});

// GET endpoint to retrieve a customer record by ID
app.get('/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id, 10);
    const customer = customers.find(c => c.id === customerId);

    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
