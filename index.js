const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://darshanmagdum:5j0M9MTUI6Wq0chy@cluster-chefcommandant.wwtw99l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-ChefCommandant'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Customer schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now } // Add createdAt field
});

// Create the customer model
const Customer = mongoose.model('Customer', customerSchema);

// POST endpoint to add a customer record
app.post('/customers', async (req, res) => {
    const { name, email, phone } = req.body;

    // Validate input
    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // Create a new customer
    const customer = new Customer({ name, email, phone });

    try {
        const savedCustomer = await customer.save(); // Save to the database
        res.status(201).json(savedCustomer); // Respond with the created customer
    } catch (error) {
        res.status(500).json({ message: 'Error saving customer', error });
    }
});


// GET endpoint to retrieve customer records by name, email, or ID (case insensitive)
app.get('/customers', async (req, res) => {
    const { name, email, id } = req.body; // Get name, email, or ID from the body

    // Validate input
    if (!name && !email && !id) {
        return res.status(400).json({ message: 'At least one of name, email, or ID is required' });
    }

    const query = {}; // Create a query object

    // Add fields to query based on input
    if (name) query.name = new RegExp(name, 'i'); // Case insensitive regex for name
    if (email) query.email = new RegExp(email, 'i'); // Case insensitive regex for email
    if (id) query._id = id;

    try {
        const customers = await Customer.find(query); // Find all customers based on the query

        if (customers.length === 0) {
            return res.status(404).json({ message: 'No customers found' });
        }

        res.json(customers); // Respond with the found customers
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
