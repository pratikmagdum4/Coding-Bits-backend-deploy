// Company Schema

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    industry: { type: String },
    website: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Create the Company model from the schema
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
