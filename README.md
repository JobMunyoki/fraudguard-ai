# FraudGuard AI

FraudGuard AI is a full-stack, AI-powered banking fraud detection and investigation platform. It analyzes banking transactions, assigns fraud risk scores through a Python machine-learning service, stores results in MySQL, and provides role-based dashboards for administrators, fraud analysts, and viewers.

> **Project status:** Portfolio-ready MVP. Local Docker deployment is complete; public cloud deployment is the next step.

---

## Overview

FraudGuard AI simulates a production-style fraud-monitoring workflow used by financial institutions:

```text
Transaction submitted
        ↓
React frontend
        ↓
Spring Boot REST API
        ↓
FastAPI machine-learning service
        ↓
RandomForestClassifier prediction
        ↓
MySQL persistence
        ↓
Fraud alerts, analyst review, reports, and audit logs
```

The project demonstrates full-stack development, machine-learning integration, REST API design, authentication, role-based authorization, Docker orchestration, database persistence, and fraud-investigation workflows.

---

## Main Features

### Fraud Detection

- Record banking transactions
- Send transaction data to the FastAPI AI service
- Generate fraud predictions and risk scores
- Display AI confidence, prediction source, and model used
- Fall back to rule-based scoring when the AI service is unavailable
- Classify transactions as `NORMAL`, `SUSPICIOUS`, or `FRAUD`

### Fraud Investigation

- View and search transactions
- Filter by prediction label and review status
- View complete transaction details in a modal
- Review suspicious and fraudulent transactions
- Update investigation status
- Confirm fraud, mark false positives, or resolve cases
- Escalate selected cases
- View analyst workload and assigned cases
- Track fraud alerts and flagged transaction exposure

### Dashboard and Reporting

- Total, normal, suspicious, and fraudulent transaction counts
- Pending, under-review, and confirmed-fraud case counts
- Total flagged amount
- Average risk score
- High-risk transaction percentage
- Fraud analytics charts
- Recent transactions
- CSV report export

### Authentication and Access Control

- JWT-based stateless authentication
- BCrypt password hashing
- Role-based access control
- Database-backed role verification on protected requests
- Account activation and deactivation
- Immediate rejection of disabled accounts on protected API requests
- Automatic frontend logout when a session becomes invalid
- Profile management
- User password change
- Administrator password reset
- Password confirmation and show/hide eye controls

### User Administration

Administrators can:

- Create users
- Assign roles
- Change user roles
- Disable accounts
- Reactivate accounts
- Reset another user's password
- View registered users
- Review administrative activity through audit logs

### Audit Logging

FraudGuard records security and workflow events such as:

```text
USER_CREATED
USER_ROLE_UPDATED
USER_DISABLED
USER_REACTIVATED
PROFILE_UPDATED
PASSWORD_CHANGED
USER_PASSWORD_RESET
TRANSACTION_REVIEW_UPDATED
```

---

## User Roles

| Role            | Main Permissions                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `ADMIN`         | Full administrative access, user management, audit logs, analyst workload, settings, transactions, alerts, and reports |
| `FRAUD_ANALYST` | Dashboard, transactions, fraud alerts, assigned cases, investigation actions, reports, and profile                     |
| `VIEWER`        | Read-focused access to dashboard, reports, and profile                                                                 |

---

## Technology Stack

### Frontend

- React
- Vite
- Material UI
- Axios
- React Router
- Recharts
- Nginx for the Docker production build

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- JWT authentication
- BCrypt password hashing
- MySQL Connector/J
- Maven

### AI Service

- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- Joblib
- Uvicorn
- RandomForestClassifier

### Database and Infrastructure

- MySQL 8
- Docker
- Docker Compose
- Docker health checks

---

## System Architecture

```text
┌───────────────────────────────┐
│ React + Material UI Frontend  │
│ Served by Nginx in Docker     │
└───────────────┬───────────────┘
                │ REST/JSON
                ▼
┌───────────────────────────────┐
│ Spring Boot Backend           │
│ Security, workflow, database  │
└───────────┬───────────┬───────┘
            │           │
            │           └───────────────┐
            ▼                           ▼
┌───────────────────────┐   ┌────────────────────────┐
│ MySQL Database        │   │ FastAPI AI Service     │
│ Users and cases       │   │ Fraud prediction       │
└───────────────────────┘   └───────────┬────────────┘
                                        ▼
                            ┌────────────────────────┐
                            │ RandomForest Model     │
                            │ fraud_model.joblib     │
                            └────────────────────────┘
```

---

## Project Structure

```text
fraudguard-ai/
│
├── ai-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── model.py
│   │   └── schemas.py
│   ├── models/
│   │   └── fraud_model.joblib
│   ├── train_model.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── backend/
│   ├── src/main/java/com/fraudguard/backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── FraudAlerts.jsx
│   │   │   ├── AnalystWorkload.jsx
│   │   │   ├── MyCases.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── AuditLogs.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── database/
├── docs/
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Application Pages

| Page             | Route               | Access                  |
| ---------------- | ------------------- | ----------------------- |
| Login            | `/login`            | Public                  |
| Dashboard        | `/dashboard`        | Admin, Analyst, Viewer  |
| Transactions     | `/transactions`     | Admin, Analyst          |
| Fraud Alerts     | `/fraud-alerts`     | Admin, Analyst          |
| Analyst Workload | `/analyst-workload` | Admin                   |
| My Cases         | `/my-cases`         | Analyst                 |
| Reports          | `/reports`          | Admin, Analyst, Viewer  |
| Audit Logs       | `/audit-logs`       | Admin                   |
| User Management  | `/users`            | Admin                   |
| Profile          | `/profile`          | All authenticated users |
| Settings         | `/settings`         | Admin                   |

---

## Transaction Workflow

```text
PENDING
   ↓
UNDER_REVIEW
   ↓
CONFIRMED_FRAUD / FALSE_POSITIVE
   ↓
RESOLVED
```

Supported review statuses:

```text
PENDING
UNDER_REVIEW
CONFIRMED_FRAUD
FALSE_POSITIVE
RESOLVED
```

---

## AI Model

FraudGuard AI uses a Scikit-learn `RandomForestClassifier`.

The prediction pipeline uses features derived from:

- Transaction type
- Transaction amount
- Old account balance
- New account balance
- Balance difference
- Amount-to-balance ratio
- Whether the transaction emptied the account

The AI service returns:

```json
{
  "prediction": "FRAUD",
  "risk_score": 97.0,
  "confidence": 0.97,
  "model_used": "RandomForestClassifier"
}
```

The backend also records the prediction source:

```text
AI_SERVICE
```

If the AI service is unavailable, the backend can use:

```text
FALLBACK_RULES
```

### Demo Risk Categories

```text
0–39     NORMAL
40–69    SUSPICIOUS
70–100   FRAUD
```

These thresholds are intended for demonstration and portfolio use, not for real banking decisions.

---

## API Overview

All protected backend endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
```

### Health

```http
GET /
GET /api/health
```

### Transactions

```http
GET  /api/transactions
POST /api/transactions
GET  /api/transactions/{id}
GET  /api/transactions/flagged
PUT  /api/transactions/{id}/review-status
PUT  /api/transactions/{id}/escalate
```

### Dashboard

```http
GET /api/dashboard/stats
GET /api/dashboard/sla-summary
GET /api/dashboard/sla-cases
```

### Profile and Password

```http
GET /api/profile/me
PUT /api/profile/me
PUT /api/profile/change-password
```

### User Management

```http
GET  /api/users
POST /api/users
GET  /api/users/analysts
PUT  /api/users/{userId}/role
PUT  /api/users/{userId}/status
PUT  /api/users/{userId}/password
```

### Administration

```http
GET /api/audit-logs
GET /api/analyst-workload
GET /api/sla-settings
PUT /api/sla-settings
```

Endpoint details may evolve as the project is upgraded.

---

## FastAPI Endpoints

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "UP",
  "service": "FraudGuard AI Service"
}
```

### Fraud Prediction

```http
POST /predict
```

Example request:

```json
{
  "transaction_type": "CASH_OUT",
  "amount": 300000,
  "old_balance": 120000,
  "new_balance": 0
}
```

Interactive FastAPI documentation is available locally at:

```text
http://localhost:8000/docs
```

---

## Run with Docker

### Prerequisites

Install:

- Git
- Docker Desktop
- Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/JobMunyoki/fraudguard-ai
cd fraudguard-ai
```

### 2. Create the environment file

Copy the example file:

```powershell
Copy-Item .env.example .env
```

On Linux or macOS:

```bash
cp .env.example .env
```

Set secure local values in `.env`. Do not commit that file.

Typical variables include:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/fraudguard?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=fraudguard
SPRING_DATASOURCE_PASSWORD=replace_with_a_secure_password
AI_SERVICE_URL=http://ai-service:8000
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRATION_MS=86400000
```

### 3. Build and start the services

```bash
docker compose up -d --build
```

### 4. Check service status

```bash
docker compose ps
```

### 5. Open the services

```text
Frontend:        http://localhost:5173
Backend:         http://localhost:8080
Backend health:  http://localhost:8080/api/health
AI service:      http://localhost:8000
AI API docs:     http://localhost:8000/docs
MySQL host port: 3307
```

### 6. View logs

```bash
docker compose logs -f
```

Backend only:

```bash
docker logs fraudguard-backend --tail 100
```

### 7. Stop the project

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```

> Running `docker compose down -v` deletes the local Docker database data.

---

## Manual Development Setup

Docker is the recommended way to run the complete project. The services can also be run separately for development.

### AI Service

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Backend

Configure the database and environment variables, then run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

---

## Sample Transaction

```json
{
  "transactionReference": "TXN-1001",
  "customerId": "CUST-001",
  "transactionType": "TRANSFER",
  "amount": 95000,
  "oldBalance": 100000,
  "newBalance": 5000,
  "destinationAccount": "ACC-98765"
}
```

The exact result depends on the trained model and feature pipeline.

---

## Security Measures

The current MVP includes:

- JWT authentication
- Stateless Spring Security configuration
- BCrypt password hashing
- Role-based endpoint authorization
- CORS configuration
- Account activation and deactivation
- Database status checks during JWT authentication
- Disabled-account session rejection
- Password confirmation
- User and administrator password-management flows
- Audit logging for important account events
- Environment-file exclusion through `.gitignore`

Never commit:

```text
.env
database passwords
JWT secrets
email credentials
API keys
private certificates
```

---

## Screenshots

Add final screenshots to:

```text
docs/screenshots/
```

Recommended screenshots:

- Login page
- Dashboard
- Add transaction form
- Transactions page
- Fraud Alerts page
- Analyst Workload page
- My Cases page
- Reports page
- Audit Logs page
- User Management page
- Profile and password-management page

After adding the files, enable links such as:

```md
![Dashboard](docs/screenshots/dashboard.png)
![Transactions](docs/screenshots/transactions.png)
![Fraud Alerts](docs/screenshots/fraud-alerts.png)
![User Management](docs/screenshots/user-management.png)
```

---

## Deployment Status

Public deployment is being prepared.

After deployment, replace this section with the real URLs:

```text
Frontend:       REPLACE_WITH_FRONTEND_URL
Backend health: REPLACE_WITH_BACKEND_HEALTH_URL
AI API docs:    REPLACE_WITH_AI_DOCS_URL
```

Do not publish real administrator credentials. Create dedicated demo accounts with fictional data.

---

## Current Limitations

- The machine-learning model uses a limited demonstration dataset.
- The project is not designed or certified for real banking use.
- Settings are still stored partly in browser `localStorage`.
- Password changes and administrator resets do not yet invalidate every previously issued JWT.
- Two-factor authentication and forgot-password email recovery are not yet implemented.
- Explainable-AI output, model drift monitoring, and model governance are not yet implemented.
- Automated test coverage and production observability still need expansion.
- Public cloud deployment URLs have not yet been added.

---

## Planned Improvements

- Force password change after administrator reset
- JWT token versioning and “log out all sessions”
- Forgot-password email workflow
- Two-factor authentication
- Failed-login lockout and login history
- Explainable AI using SHAP
- Model monitoring and model versioning
- Fraud-model retraining pipeline
- Bulk CSV transaction upload
- Investigation notes and evidence attachments
- PDF report export
- Database migrations with Flyway
- OpenAPI documentation for Spring Boot
- Unit, integration, and frontend tests
- GitHub Actions CI/CD
- Rate limiting, structured logging, and production monitoring

---

## Portfolio Value

FraudGuard AI demonstrates:

- Full-stack application architecture
- AI service integration
- Secure REST API development
- Role-based authorization
- Relational database design
- Dockerized microservice deployment
- Administrative user management
- Fraud investigation workflows
- Reporting and auditability

---

## Author

**Job Munyoki**

Full-stack developer focused on artificial intelligence, cybersecurity, fintech systems, and data-driven applications.

- GitHub: `https://github.com/JobMunyoki`
- Portfolio: `https://jobmunyoki.vercel.app`
