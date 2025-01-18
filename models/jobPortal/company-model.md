# Company Model Documentation

## Overview
The `Company` model is used to manage company information in the system. It includes fields for company details and tracks the relationship with job postings.

## Schema Fields
- **name**: The name of the company. (Required)
- **email**: The company's email address. (Required, Unique, Validated with a basic email format)
- **website**: (Optional) URL of the company's website. Must be a valid URL.
- **description**: (Optional) A brief description of the company, with a maximum length of 1000 characters.
- **logo**: (Optional) URL to the company's logo. Defaults to `https://example.com/default-logo.png`.
- **jobsPosted**: Array of references to the `Job` model. Tracks jobs posted by the company.

## Features
- **Default Values**: 
  - `logo` defaults to a placeholder URL.
- **Validation**: 
  - `email` must match a valid email format.
  - `website` must match a valid URL format.
- **Indexes**:
  - Indexed by `email` and `name` for efficient querying.

## How to Use
- **Model Import**:
  ```javascript
  const Company = require('./models/Company');
