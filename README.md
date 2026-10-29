# Healthcare Backend API

A secure, multi-tenant RESTful backend service for healthcare management built with **Node.js**, **Express**, and **PostgreSQL (Sequelize ORM)**. The system provides user authentication via JWT and full CRUD capabilities for managing patients, doctors, and patient-doctor consultations.

---

## Features

- **JWT Authentication**: Stateless authentication with hashed passwords (`bcrypt`).
- **Data Isolation**: Each user can only access and manage their own patient and doctor records.
- **Patient & Doctor Management**: Complete REST endpoints to register, view, update, and delete records.
- **Consultation Mapping**: Assign and manage doctor-patient relationships with duplicate-assignment prevention.
- **Validation & Error Handling**: Strict schema validation using `express-validator` and centralized error handling.
- **Security**: Hardened HTTP headers with `helmet`, configurable `cors`, and structured logging with `morgan`.
- **PostgreSQL + Sequelize ORM**: Auto-synchronizing relational models with cascade deletes on associations.

---

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL (compatible with local Postgres, Neon, Supabase, AWS RDS)
- **ORM**: Sequelize
- **Security & Auth**: `jsonwebtoken`, `bcrypt`, `helmet`, `cors`
- **Validation**: `express-validator`

---

## Directory Structure

```text
healthcare-backend/
├── .env.example
├── .gitignore
├── Healthcare_API.postman_collection.json
├── package.json
├── README.md
└── src/
    ├── app.js                  # Express app setup, middleware, route mounting
    ├── server.js               # Entry point, DB connection & server listen
    ├── config/
    │   └── database.js         # PostgreSQL connection & SSL pooling
    ├── controllers/
    │   ├── authController.js   # User registration & login logic
    │   ├── doctorController.js # Doctor CRUD operations
    │   ├── mappingController.js# Patient-doctor assignments
    │   └── patientController.js# Patient CRUD operations
    ├── middleware/
    │   ├── authMiddleware.js   # JWT verification middleware
    │   ├── errorHandler.js     # Centralized error handler
    │   └── validateRequest.js  # express-validator result handler
    ├── models/
    │   ├── index.js            # Sequelize relational associations
    │   ├── Doctor.js           # Doctor model
    │   ├── Patient.js          # Patient model
    │   ├── PatientDoctorMapping.js # Mapping junction model
    │   └── User.js             # User model
    └── routes/
        ├── authRoutes.js       # Auth endpoints (/api/auth)
        ├── doctorRoutes.js     # Doctor endpoints (/api/doctors)
        ├── mappingRoutes.js    # Mapping endpoints (/api/mappings)
        └── patientRoutes.js    # Patient endpoints (/api/patients)
```

---

## Getting Started

### 1. Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local instance or cloud instance like Neon / Supabase)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repository-url>
cd healthcare-backend
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your `.env` variables:

```ini
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/healthcare_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
```

> **Note**: For cloud PostgreSQL (e.g. Neon), simply paste the connection string into `DATABASE_URL`. SSL is automatically detected and configured.

### 4. Run the Application

```bash
# Development mode (with nodemon auto-restart)
npm run dev

# Production mode
npm start
```

The server will automatically authenticate with the database, synchronize tables, and start listening on the configured port.

---

## API Endpoints

All protected endpoints require the header:  
`Authorization: Bearer <your_jwt_token>`

### 1. Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login/` | Log in user and receive JWT token | No |

### 2. Patient Management

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/patients/` | Create a new patient (`name`, `age`, `gender`) | Yes |
| `GET` | `/api/patients/` | Retrieve all patients of authenticated user | Yes |
| `GET` | `/api/patients/:id/` | Get details of a specific patient | Yes |
| `PUT` | `/api/patients/:id/` | Update patient record | Yes |
| `DELETE` | `/api/patients/:id/` | Delete patient record | Yes |

### 3. Doctor Management

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/doctors/` | Add a doctor (`name`, `specialization`, `email`) | Yes |
| `GET` | `/api/doctors/` | Retrieve all doctors of authenticated user | Yes |
| `GET` | `/api/doctors/:id/` | Get details of a specific doctor | Yes |
| `PUT` | `/api/doctors/:id/` | Update doctor record | Yes |
| `DELETE` | `/api/doctors/:id/` | Delete doctor record | Yes |

### 4. Patient-Doctor Mapping

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/mappings/` | Assign a doctor to a patient (`patientId`, `doctorId`) | Yes |
| `GET` | `/api/mappings/` | Retrieve all patient-doctor mappings | Yes |
| `GET` | `/api/mappings/:patient_id/` | Get all doctors assigned to a specific patient | Yes |
| `DELETE` | `/api/mappings/:id/` | Remove doctor from a patient | Yes |

### 5. Health Check

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service uptime and status check | No |

---

## Postman Testing

A ready-to-use Postman collection is included in the root directory:  
📁 `Healthcare_API.postman_collection.json`

**How to test:**
1. Open Postman -> Click **Import** -> Select `Healthcare_API.postman_collection.json`.
2. The collection uses variable `{{base_url}}` (default `http://localhost:5000`).
3. Run **Register User**, then run **Login User**.
4. The login test script automatically sets the `{{token}}` variable for all subsequent requests.

---

## License

This project is licensed under the [MIT License](LICENSE).
