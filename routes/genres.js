const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
// Get request to get all the movies inside the database
router.get('/', async (req, res, next) => {
    try {
        const genres = await Genre.find().sort('name');
        res.send(genres);
    } catch (ex) {
        next(ex);
    }

});
// Post request to make new genre
router.post('/', auth, async (req, res) => {
    // if not found send an error


    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // if found form a new genre, insert in to the database and return the new one
    let genre = new Genre({
        name: req.body.name,
    });
    genre = await genre.save();
    res.send(genre);
});
// Put request to update a genre
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    //get the genre with the given id and if not found return 404
    //  const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found')
    // if found validate the input
    // if everything is okay update the genre and send it back
    res.send(genre);
});
//Delete request to delete a genre with a given ID
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    // get the genre with the given id if not found return 404
    //const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with  the given id was not found');
    // if found remeove the genre from the list of genres
    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);
    // return the removed genre
    res.send(genre);
});
// Get a specific genre with a given id
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    // get the genre or else return 404 status
    //const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The request with given ID was not found');
    // if found return the genre
    res.send(genre);
});
module.exports = router;