// Job Category Schema

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});

// Create the Category model from the schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
