const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://darshanmagdum:5j0M9MTUI6Wq0chy@cluster-chefcommandant.wwtw99l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-ChefCommandant'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the customer schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
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

// GET endpoint to retrieve a customer record by ID
app.get('/customers/:id', async (req, res) => {
    const customerId = req.params.id;

    try {
        const customer = await Customer.findById(customerId); // Find customer by ID

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer); // Respond with the found customer
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
