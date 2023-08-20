const express = require('express');
const bodyParser = require('body-parser');
const ConnectDb = require('./Db/Connect');
const Person = require('./Db/Models/PersonModel.js');
const app = express();
const PORT = 8000
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).json({msg: "Welcome to the Person Database"});
})

app.post('/createPerson', async (req, res) => {
    try {
        const { name, dob, nationality, voterId } = req.body;
        const person = new Person({ name, dob, nationality, voterId });
        const savedPerson = await person.save();
        console.log(savedPerson);
        res.status(201).json(savedPerson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get('/getAllPeople', async (req, res) => {
    try {
        const people = await Person.find();
        if (people.length === 0) {
            res.status(200).json({ message: 'No users available' });
        } else {
            res.status(200).json(people);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/getPerson/:voterId', async (req, res) => {
    try {
        const voterId = req.params.voterId;
        const person = await Person.findOne({ voterId });
        if (person) {
            res.status(200).json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/updatePerson/:voterId', async (req, res) => {
    try {
        const voterId = req.params.voterId;
        const updatedData = req.body;
        const updatedPerson = await Person.findOneAndUpdate(
            { voterId },
            updatedData,
            { new: true } // Return the updated document
        );
        if (updatedPerson) {
            res.status(200).json(updatedPerson);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


(function (){
    ConnectDb().then(()=>{
        app.listen(PORT, () => {
            console.log('API server is running on port ' + PORT);
        });
    }).catch((err)=>{console.log(err)});
})()


