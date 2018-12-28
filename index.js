const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
    {id:1, name:'Action'},
    {id:2, name:'Horror'},
    {id:3, name:'Romance'},

];

// Get request to get all the movies inside the database
app.get('/api/genres',(req,res)=>{
    res.send(genres);
});
// Post request to make new genre

app.post('/api/genres',(req,res)=>{

    // if not found send an error
    const {error} = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // if found form a new genre, insert in to the database and return the new one

    const genre = {
        id:genres.length+1,
        name:req.body.name,
    };

    genres.push(genre);
    res.send(genre);
    
});

// Put request to update a genre

app.put('/api/genres/:id',(req,res)=>{
    //get the genre with the given id and if not found return 404
    const genre = genres.find(c=>c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with the given ID was not found') 
    // if found validate the input

    const {error} = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // if everything is okay update the genre and send it back
    genre.name= req.body.name;
    res.send(genre);

});

//Delete request to delete a genre with a given ID
app.delete('/api/genres/:id',(req,res)=>{
    // get the genre with the given id if not found return 404
    const genre = genres.find(c=>c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with  the given id was not found');
    // if found remeove the genre from the list of genres
    const index = genres.indexOf(genre);
    genres.splice(index,1);

    // return the removed genre

    res.send(genre);


});

// Get a specific genre with a given id

app.get('/api/genres/:id',(req,res)=>{

    // get the genre or else return 404 status
    
    const genre = genres.find(c=>c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The request with given ID was not found');

    // if found return the genre

    res.send(genre);

});



// Joi validator
function validateGenres(genre){
    const schema = {
        name:Joi.string().min(3).required()
    };
return Joi.validate(genre,schema);

};




//Port Assignmet
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`Listening on port${port}........`));