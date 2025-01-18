# MERN Backend Repository

Welcome to the **MERN Backend Repository** for a multi-functional platform encompassing a **Job Portal**, **Freelancer Marketplace**, and **Course Management System**. This repository is built with **Node.js**, **Express.js**, and **MongoDB** as the primary technologies.

## Overview

This backend serves three major subsystems:

### 1. **Job Portal**
- **Recruiter Features**:
  - Post job listings.
  - Manage job postings (edit/delete).
- **Job Finder Features**:
  - Create and maintain a profile with relevant details (skills, experience, etc.).
  - View job matches based on profile attributes.
  - Apply for suitable jobs.

### 2. **Freelancer Marketplace**
- **Client Features**:
  - Post project requirements and descriptions.
  - View and shortlist developer profiles.
  - Assign projects to developers.
  - Manage project status.
  - Handle payment transactions.
- **Developer Features**:
  - Create and maintain a developer profile.
  - Browse and apply for projects.
  - Collaborate with clients.
  - Receive payments after project completion.

### 3. **Course Management System**
- **Teacher Features**:
  - Create and upload structured courses.
  - Conduct live lectures.
  - Manage course content (add/edit/remove).
- **Student Features**:
  - Browse available courses.
  - Purchase or subscribe to courses.
  - Attend live lectures.

## Project Structure

```
backend/
├── controllers/        # Business logic for API routes
├── models/             # MongoDB schemas for data structure
├── routes/             # API route handlers
├── middlewares/        # Authentication, validation, etc.
├── utils/              # Helper functions and utilities
├── config/             # Environment variables and database configuration
└── app.js              # Entry point for the application
```

## MongoDB Schema Overview

### 1. **Job Portal**
- **User Schema** (common for recruiters and job seekers):
  ```json
  {
    "name": "String",
    "email": "String",
    "password": "String",
    "role": "String" // 'recruiter' or 'job_seeker'
  }
  ```
- **Job Schema**:
  ```json
  {
    "title": "String",
    "description": "String",
    "company": "String",
    "location": "String",
    "skillsRequired": ["String"],
    "postedBy": "ObjectId" // Reference to User Schema
  }
  ```
- **Application Schema**:
  ```json
  {
    "jobId": "ObjectId",
    "userId": "ObjectId",
    "status": "String" // 'applied', 'shortlisted', 'rejected', etc.
  }
  ```

### 2. **Freelancer Marketplace**
- **Client Schema**:
  ```json
  {
    "name": "String",
    "email": "String",
    "password": "String"
  }
  ```
- **Developer Schema**:
  ```json
  {
    "name": "String",
    "email": "String",
    "password": "String",
    "skills": ["String"],
    "experience": "Number"
  }
  ```
- **Project Schema**:
  ```json
  {
    "title": "String",
    "description": "String",
    "budget": "Number",
    "client": "ObjectId",
    "developersApplied": ["ObjectId"],
    "assignedTo": "ObjectId", // Reference to Developer
    "status": "String" // 'open', 'in_progress', 'completed'
  }
  ```
- **Payment Schema**:
  ```json
  {
    "projectId": "ObjectId",
    "clientId": "ObjectId",
    "developerId": "ObjectId",
    "amount": "Number",
    "status": "String" // 'pending', 'paid'
  }
  ```

### 3. **Course Management System**
- **Teacher Schema**:
  ```json
  {
    "name": "String",
    "email": "String",
    "password": "String"
  }
  ```
- **Student Schema**:
  ```json
  {
    "name": "String",
    "email": "String",
    "password": "String",
    "subscriptions": ["ObjectId"] // Reference to Course Schema
  }
  ```
- **Course Schema**:
  ```json
  {
    "title": "String",
    "description": "String",
    "price": "Number",
    "teacherId": "ObjectId",
    "content": ["String"], // List of video URLs or resources
    "studentsEnrolled": ["ObjectId"]
  }
  ```

## Getting Started

### Prerequisites
- Node.js (v16 or above)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=<Your MongoDB Connection String>
     JWT_SECRET=<Your JWT Secret>
     ```
4. Start the server:
   ```bash
   npm start
   ```

### API Endpoints
#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user

#### Job Portal
- `POST /api/jobs` - Post a new job (Recruiter only)
- `GET /api/jobs` - Fetch all jobs (Job Seekers only)
- `POST /api/jobs/:id/apply` - Apply for a job (Job Seeker only)

#### Freelancer Marketplace
- `POST /api/projects` - Post a new project (Client only)
- `GET /api/projects` - Fetch all projects (Developers only)
- `POST /api/projects/:id/assign` - Assign a developer to a project (Client only)

#### Course Management
- `POST /api/courses` - Create a new course (Teacher only)
- `GET /api/courses` - Fetch all courses (Students only)
- `POST /api/courses/:id/subscribe` - Subscribe to a course (Student only)

## Contributing
Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the MIT License. See the LICENSE file for details.

