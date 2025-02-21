// Skills Schema

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String }
});

// Create the Skill model from the schema
const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
