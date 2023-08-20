const mongoose = require('mongoose');

// Define the schema
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    nationality: { type: String, required: true },
    voterId: { type: String, required: true, unique: true }
});

// Create the model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
