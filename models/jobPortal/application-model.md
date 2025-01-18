# Application Model Documentation

## Overview
The `Application` model is used to manage job applications in the system. It tracks the relationship between job postings, users, and the application status.

## Schema Fields
- **jobId**: Reference to the `Job` model. Represents the job the user is applying for.
- **userId**: Reference to the `User` model. Identifies the user submitting the application.
- **status**: Tracks the current state of the application. Possible values:
  - `applied`: Default state when a user applies.
  - `shortlisted`: When the user is shortlisted for further processing.
  - `rejected`: When the application is rejected.
- **resume**: (Optional) URL to the user's resume.
- **coverLetter**: (Optional) Text field for the user's cover letter.
- **appliedAt**: Timestamp indicating when the application was submitted.

## Features
- **Default Values**: 
  - `status` defaults to `applied`.
  - `appliedAt` defaults to the current date and time.
- **Validation**: 
  - `resume` field validates URLs (must start with `http://` or `https://`).
- **Indexes**:
  - Indexed by `jobId` and `userId` for improved query performance.

## How to Use
- **Model Import**:
  ```javascript
  const Application = require('./models/Application');
