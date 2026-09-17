# Job Application Portal

A full-stack Job Application Portal built with **React.js, Node.js, Express.js, and MongoDB**.

The application allows applicants to browse available jobs, view job-specific application questions, apply to individual jobs, or apply to multiple jobs at once using a dynamic application form.

---

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* CORS
* dotenv

---

## Features

* Browse available jobs
* Search jobs by title, company, or description
* Filter jobs by location
* View detailed job information
* Dynamic application forms based on job questions
* Support for multiple question types:

  * Text
  * Textarea
  * Number
  * Dropdown
  * Checkbox
  * Boolean
* Apply to a single job
* Apply to multiple jobs using **Apply to All**
* Frontend required-field validation
* Backend schema-based validation
* Duplicate application prevention
* View submitted applications
* Loading and error states
* Responsive UI
* Seeded assignment jobs and demo applicant

---

# Project Structure

```text
Assignment_Job_Portal/
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── jobController.js
│   │   └── applicationController.js
│   │
│   ├── models/
│   │   ├── Job.js
│   │   ├── Applicant.js
│   │   └── Application.js
│   │
│   ├── routes/
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   │
│   ├── seed/
│   │   ├── jobs.js
│   │   └── applicant.js
│   │
│   ├── utils/
│   │   ├── validateAnswers.js
│   │   └── testValidation.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobCard.jsx
│   │   │   ├── QuestionRenderer.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Apply.jsx
│   │   │   ├── BulkApply.jsx
│   │   │   └── Applications.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── utils/
│   │   │   └── validateRequiredAnswers.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

---

# Data Model

The application uses three main MongoDB collections:

1. `jobs`
2. `applicants`
3. `applications`

## Job

Each job contains its basic information and its own array of application questions.

Example:

```js
{
  id: "job-1",
  title: "Frontend Developer",
  company: "Nova Labs",
  location: "Remote",
  description: "Build responsive React dashboards.",
  questions: [
    {
      id: "q1",
      label: "Full name",
      type: "text",
      required: true
    },
    {
      id: "q2",
      label: "Years of React experience",
      type: "number",
      required: true
    }
  ]
}
```

The question schema is embedded inside the Job document because the questions belong directly to that specific job.

Each question contains:

* `id`
* `label`
* `type`
* `required`
* `options` when required by the question type

Supported question types are:

```text
text
textarea
number
dropdown
checkbox
boolean
```

---

## Applicant

Applicants are stored separately from jobs and applications.

Example:

```js
{
  name: "Demo Applicant",
  email: "demo@example.com"
}
```

For this assignment, a seeded demo applicant is used because authentication was not part of the required functionality.

---

## Application

An application connects an applicant with a job and stores the answers submitted for that job.

Example:

```js
{
  applicant: ObjectId,
  job: ObjectId,
  answers: [
    {
      questionId: "q1",
      value: "John Doe"
    },
    {
      questionId: "q2",
      value: 2
    }
  ],
  status: "submitted"
}
```

The `value` field uses MongoDB's `Mixed` type because different question types can produce different JavaScript values such as:

* Strings
* Numbers
* Arrays
* Booleans

A compound unique index is used on:

```text
applicant + job
```

This prevents the same applicant from applying to the same job more than once.

---

# Dynamic Application Form

The application form is driven entirely by the `questions` array returned by the backend.

The frontend does not contain job-specific form fields.

The application page maps through the questions:

```jsx
job.questions.map((question) => (
  <QuestionRenderer
    question={question}
    value={answers[question.id]}
    onChange={handleAnswerChange}
  />
))
```

The reusable `QuestionRenderer` component determines which input control to display based on:

```js
question.type
```

For example:

```text
text      → text input
textarea  → textarea
number    → number input
dropdown  → select
checkbox  → checkbox options
boolean   → yes/no radio buttons
```

This allows different jobs to have completely different application questions without creating separate forms for each job.

For example, the Frontend Developer job can ask about React experience, while the Content Writer job can ask for a portfolio URL and writing topics.

---

# Adding New Jobs or Question Types

Adding a new job with a different set of questions does not require changes to the main application form.

The form reads the question configuration directly from the backend.

For example, adding a new job with:

```js
{
  id: "q1",
  label: "Portfolio URL",
  type: "text",
  required: true
}
```

automatically causes the appropriate input to be rendered.

Question rendering is centralized inside `QuestionRenderer`.

If a completely new question type is introduced, support for that type would be added to `QuestionRenderer` and to the backend validation logic. The main application form itself would remain unchanged.

This keeps the form architecture reusable and avoids creating job-specific components.

---

# Apply to All

Applicants can select multiple jobs from the jobs listing and click:

```text
Apply to All
```

The selected job IDs are passed to the bulk application page through the URL:

```text
/bulk-apply?jobs=job-1,job-2,job-3
```

The frontend then fetches each selected job and renders its questions dynamically.

Because different jobs can have different question sets, answers are stored in a nested state structure.

Example:

```js
{
  "job-1": {
    "q1": "John Doe",
    "q2": 2,
    "q3": "Remote"
  },

  "job-2": {
    "q1": "John Doe",
    "q2": "https://portfolio.example",
    "q3": ["Tech", "Finance"],
    "q4": "My sample pitch"
  }
}
```

This structure prevents questions with the same ID from different jobs from conflicting with each other.

Before submission, the frontend converts the answers into the backend request format:

```js
{
  applicantId: "APPLICANT_ID",

  applications: [
    {
      jobId: "job-1",
      answers: [...]
    },

    {
      jobId: "job-2",
      answers: [...]
    }
  ]
}
```

The backend then validates every application against its corresponding job's question schema.

---

# Apply to All Trade-off

The bulk endpoint follows an **all-or-nothing validation approach**.

The backend first validates every selected application.

If any selected application contains:

* Missing required answers
* Invalid answer types
* Invalid dropdown options
* Invalid checkbox options
* An invalid job
* A duplicate application

the request is rejected and no new applications are inserted.

This prevents a confusing situation where an applicant clicks **Apply to All** but only some applications are successfully submitted.

### Trade-off

The main trade-off is that one invalid application can prevent otherwise valid applications from being submitted.

For a production system, I would consider using database transactions or explicitly supporting partial-success responses depending on the product requirements.

---

# Validation

Validation is implemented on both the frontend and backend.

## Frontend Validation

The frontend performs basic required-field validation before sending the request.

This provides immediate feedback to the user and avoids unnecessary API requests.

It checks for:

* Missing required text values
* Missing required number values
* Missing required dropdown selections
* Empty required checkbox selections
* Missing required boolean answers

A boolean value of `false` is treated as a valid answer.

---

## Backend Validation

The backend is the final source of truth because frontend validation can be bypassed.

The backend validates submitted answers against the question schema stored with the job.

It checks:

* Required fields
* Answer data types
* Dropdown options
* Checkbox options
* Boolean values
* Unknown question IDs
* Duplicate question IDs

For example, if a question is defined as:

```js
{
  type: "dropdown",
  options: ["Remote", "Hybrid", "On-site"]
}
```

the backend rejects a value outside those options.

This prevents a client from bypassing validation by sending a request directly through tools such as Postman.

---

# API Endpoints

## Get All Jobs

```http
GET /jobs
```

Supports search and location filtering.

Examples:

```text
/jobs?search=developer
/jobs?location=Remote
/jobs?search=developer&location=Remote
```

---

## Get a Single Job

```http
GET /jobs/:id
```

Example:

```text
GET /jobs/job-1
```

---

## Apply to a Single Job

```http
POST /jobs/:id/apply
```

Example request:

```json
{
  "applicantId": "APPLICANT_ID",
  "answers": [
    {
      "questionId": "q1",
      "value": "John Doe"
    },
    {
      "questionId": "q2",
      "value": 2
    },
    {
      "questionId": "q3",
      "value": "Remote"
    }
  ]
}
```

---

## Apply to Multiple Jobs

```http
POST /applications/bulk
```

Example request:

```json
{
  "applicantId": "APPLICANT_ID",
  "applications": [
    {
      "jobId": "job-1",
      "answers": [
        {
          "questionId": "q1",
          "value": "John Doe"
        }
      ]
    },
    {
      "jobId": "job-2",
      "answers": [
        {
          "questionId": "q1",
          "value": "John Doe"
        }
      ]
    }
  ]
}
```

---

## Get Applications

```http
GET /applications?applicantId=APPLICANT_ID
```

Returns applications submitted by the specified applicant.

---

# HTTP Status Codes

| Status Code | Usage                                 |
| ----------- | ------------------------------------- |
| 200         | Successful GET request                |
| 201         | Application successfully created      |
| 400         | Invalid request or validation failure |
| 404         | Job or applicant not found            |
| 409         | Duplicate application                 |
| 500         | Unexpected server error               |

---

# Error Handling

The backend wraps controller operations in `try/catch` blocks.

Validation errors return structured information so the frontend can display useful messages.

Example:

```json
{
  "success": false,
  "message": "Invalid application answers",
  "errors": [
    {
      "questionId": "q2",
      "message": "Years of React experience must be a number"
    }
  ]
}
```

The frontend reads these errors and displays an appropriate message to the user.

---

# Setup Instructions

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas

---

## 1. Clone the Repository

```bash
git clone https://github.com/PardeepSingh17/assignment-job-portal.git
cd Assignment_Job_Portal
```

---

## 2. Backend Setup

Open a terminal:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:8080
```

---

## 3. Seed the Required Jobs

From the `Backend` directory:

```bash
npm run seed
```

This loads the three required assignment jobs into MongoDB.

To seed the demo applicant:

```bash
npm run seed:applicant
```

---

## 4. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# Environment Variables

The backend requires:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
```

The `.env` file should never be committed to GitHub.

The actual MongoDB connection string must be kept private.

---

# Scaling Considerations

The current implementation is designed for the assignment scope.

For a production system with approximately **10,000 jobs and 1 million applications**, several improvements could be made.

## Database Indexing

Indexes should be added for frequently queried fields.

Potential indexes include:

* Job location
* Job title
* Job creation date
* Application applicant ID
* Application job ID
* Application creation date

The existing compound unique index on:

```text
applicant + job
```

would remain to prevent duplicate applications.

---

## Pagination

The current job endpoint can be extended with pagination instead of returning every matching job.

For example:

```text
/jobs?page=1&limit=20
```

For very large datasets, cursor-based pagination could also be considered.

---

## Search Optimization

For more advanced job searching, indexed search or a dedicated search engine could be introduced instead of relying only on regular-expression queries.

---

## Application Queries

Application queries should use indexed fields such as:

```text
applicant
job
createdAt
```

This keeps lookups efficient as the number of applications grows.

---

## Caching

Frequently accessed job information could be cached using a caching layer such as Redis.

This could reduce repeated database reads for popular job listings.

---

## Backend Scaling

As traffic increases, the backend could be horizontally scaled behind a load balancer.

The API servers would remain stateless so multiple instances could process requests.

---

## Database Optimization

For a larger production system, I would also consider:

* Query optimization
* Proper projections to return only required fields
* Connection pooling
* Database monitoring
* Archiving old application data if required
* Background processing for non-critical tasks such as emails

---

# Authentication

Authentication was not required for the core assignment, so the current implementation uses a seeded demo applicant ID.

In a production application, I would authenticate users and derive the applicant identity on the backend rather than accepting an arbitrary applicant ID from the client.

JWT-based authentication could be added as an additional layer, with middleware validating the token and attaching the authenticated applicant to the request.

This would also allow different applicants to securely access only their own applications.

---

# Future Improvements

Possible production improvements include:

* User authentication and authorization
* Recruiter dashboard
* Job creation and management
* Application status management
* Applicant profiles
* Resume uploads
* Email notifications
* Database transactions for bulk applications
* Automated unit and integration tests
* Deployment and CI/CD
* Advanced job search
* Saved jobs
* Application tracking

---

# Assignment Notes

The three jobs provided in the assignment are used as the seeded dataset.

The implementation focuses on the required functionality first, including:

* Dynamic application forms
* Multiple question types
* Schema-based validation
* Single applications
* Bulk applications
* Duplicate application prevention
* Application history
* Search and filtering
* Loading and error handling
* Responsive UI

Authentication, recruiter functionality, automated tests, and deployment were treated as additional enhancements because they were listed as bonus functionality.

---

# Demo

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:8080
```

### Main Pages

```text
/                       → Browse Jobs
/jobs/:id               → Job Details
/jobs/:id/apply         → Apply to Job
/bulk-apply             → Apply to All
/applications           → My Applications
```

---

# Author

**Pardeep Singh**

Full Stack Developer

Built using React.js, Node.js, Express.js, and MongoDB.
