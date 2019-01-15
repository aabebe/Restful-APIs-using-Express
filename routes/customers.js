const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');
// Get request to get all the movies inside the database
router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
});
// Post request to make new genre
router.post('/', auth, async (req, res) => {
    // if not found send an error
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // if found form a new genre, insert in to the database and return the new one
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer = await customer.save();
    res.send(customer);
});
// Put request to update a customer
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true });
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});
// Delete to delete a customer
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID wasnot found');
    res.send(customer);
});
//Get a customer by a specific ID
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
})
// Joi validator
module.exports = router;