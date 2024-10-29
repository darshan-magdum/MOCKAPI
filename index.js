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
    createdAt: { type: Date, default: Date.now }
});

// Create the customer model
const Customer = mongoose.model('Customer', customerSchema);

// POST endpoint to add a customer record
app.post('/customers', async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const customer = new Customer({ name, email, phone });

    try {
        await customer.save();
        res.status(201).json({ message: 'Customer successfully created' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving customer', error });
    }
});

// GET endpoint to retrieve customer records by name, email, or ID (case insensitive)
app.get('/customers', async (req, res) => {
    const { name, email, id } = req.body;

    if (!name && !email && !id) {
        return res.status(400).json({ message: 'At least one of name, email, or ID is required' });
    }

    const query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (email) query.email = new RegExp(email, 'i');
    if (id) query._id = id;

    try {
        const customers = await Customer.find(query);

        if (customers.length === 0) {
            return res.status(404).json({ message: 'No customers found' });
        }

        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error });
    }
});

// PUT endpoint to update a customer record by ID
app.put('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    // Validate input
    if (!name && !email && !phone) {
        return res.status(400).json({ message: 'At least one of name, email, or phone is required' });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer successfully modified' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error });
    }
});

// DELETE endpoint to remove a customer record by ID
app.delete('/customers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
