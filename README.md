# FraudGuard AI

FraudGuard AI is an AI-powered banking fraud detection system built with Java Spring Boot, Python FastAPI, Scikit-learn, React, Material UI, and MySQL.

The system analyzes banking transactions, predicts fraud risk using a machine learning service, stores transaction results in MySQL, and provides a professional fraud analyst dashboard for monitoring, reviewing, and reporting suspicious financial activity.

---

## Project Overview

FraudGuard AI simulates a real-world fraud monitoring platform used by financial institutions to detect suspicious and fraudulent transactions.

The system supports:

- Transaction recording
- AI-powered fraud prediction
- Fraud risk scoring
- Fraud alerts
- Review workflow
- Dashboard analytics
- CSV report export
- AI confidence tracking
- Prediction source tracking
- Model-used tracking
- Analyst settings page

---

## System Architecture

```text
React Frontend
     |
     v
Spring Boot Backend
     |
     v
FastAPI AI Service
     |
     v
Scikit-learn RandomForestClassifier Model

Spring Boot also connects to:

MySQL Database
```

### Main Flow

```text
1. User enters a transaction from the React dashboard.
2. React sends the transaction to the Spring Boot backend.
3. Spring Boot sends transaction details to the FastAPI AI service.
4. FastAPI loads the trained RandomForestClassifier model.
5. The AI service returns prediction, risk score, confidence, and model used.
6. Spring Boot saves the transaction and prediction result in MySQL.
7. React dashboard displays the updated transaction, fraud alert, analytics, and reports.
```

---

## Tech Stack

### Frontend

- React
- Vite
- Material UI
- Axios
- Recharts
- React Router

### Backend

- Java Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL Driver
- REST APIs

### AI Service

- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- Joblib
- Uvicorn

### Database

- MySQL

---

## Key Features

## 1. Dashboard

The dashboard provides a quick overview of fraud monitoring activity.

Features include:

- Total transactions
- Normal transactions
- Suspicious transactions
- Fraud transactions
- Pending reviews
- Under review cases
- Confirmed fraud cases
- Total flagged amount
- Average risk score
- High-risk percentage
- Fraud analytics charts
- Recent transactions table
- Add transaction form
- AI confidence display
- AI prediction source display

---

## 2. AI-Powered Fraud Prediction

FraudGuard AI uses a Python FastAPI service with a trained Scikit-learn RandomForestClassifier model.

The AI service returns:

```json
{
  "prediction": "FRAUD",
  "risk_score": 97.0,
  "confidence": 0.97,
  "model_used": "RandomForestClassifier"
}
```

The backend stores:

- Risk score
- Prediction label
- Confidence
- Model used
- Prediction source

Example prediction source:

```text
AI_SERVICE
```

If the AI service is unavailable, the backend falls back to rule-based scoring:

```text
FALLBACK_RULES
```

---

## 3. Transactions Page

The Transactions page allows fraud analysts to manage all recorded banking transactions.

Features include:

- View all transactions
- Search by transaction reference, customer ID, or destination account
- Filter by prediction label
- Filter by review status
- View risk score
- View AI confidence
- View prediction source
- View model used
- Update review status

Supported review statuses:

```text
PENDING
UNDER_REVIEW
CONFIRMED_FRAUD
FALSE_POSITIVE
RESOLVED
```

---

## 4. Fraud Alerts Page

The Fraud Alerts page displays only transactions classified as:

```text
SUSPICIOUS
FRAUD
```

Features include:

- Total alerts
- Fraud alerts
- Suspicious alerts
- Critical risk alerts
- Total alert exposure
- Search alerts
- Filter alerts
- Review fraud cases
- Confirm fraud
- Mark false positive
- Resolve alerts
- AI confidence display
- AI source display
- Model used display

---

## 5. Reports Page

The Reports page provides fraud analytics and exportable reporting.

Features include:

- Total transactions
- Fraud transactions
- Suspicious transactions
- Confirmed fraud cases
- Total flagged amount
- Average risk score
- High-risk percentage
- Prediction breakdown chart
- Review status chart
- Transactions by type chart
- Flagged transactions report
- CSV export

The exported CSV includes:

- Transaction reference
- Customer ID
- Transaction type
- Amount
- Old balance
- New balance
- Risk score
- Prediction
- Confidence
- Prediction source
- Model used
- Review status

---

## 6. Settings Page

The Settings page allows configuration of system preferences.

Current settings are saved in browser localStorage.

Settings include:

- Analyst name
- Analyst role
- Organization name
- Fraud risk threshold
- Critical risk threshold
- Notification mode
- Email alert toggle
- Critical alert toggle
- Audit logging toggle
- Model mode
- Session timeout

---

## Project Structure

```text
fraudguard-ai/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/fraudguard/backend/
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   ├── service/
│   │       │   └── BackendApplication.java
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── ai-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── model.py
│   │   └── schemas.py
│   │
│   ├── models/
│   │   └── fraud_model.joblib
│   │
│   ├── train_model.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── FraudAlerts.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── database/
├── docs/
├── README.md
├── .gitignore
└── docker-compose.yml
```

---

## Backend API Endpoints

### Health Check

```http
GET /api/health
```

Example response:

```json
{
  "service": "FraudGuard AI Backend",
  "status": "UP",
  "message": "Backend is running successfully"
}
```

---

### Get All Transactions

```http
GET /api/transactions
```

Returns all transactions.

---

### Create Transaction

```http
POST /api/transactions
```

Creates a new transaction and sends it to the AI service for fraud prediction.

Example request:

```json
{
  "transactionReference": "TXN-006",
  "customerId": "CUST-1006",
  "transactionType": "CASH_OUT",
  "amount": 300000,
  "oldBalance": 120000,
  "newBalance": 0,
  "destinationAccount": "ACC-9006"
}
```

Example response:

```json
{
  "id": 6,
  "transactionReference": "TXN-006",
  "customerId": "CUST-1006",
  "transactionType": "CASH_OUT",
  "amount": 300000,
  "oldBalance": 120000,
  "newBalance": 0,
  "destinationAccount": "ACC-9006",
  "riskScore": 97.0,
  "confidence": 0.97,
  "modelUsed": "RandomForestClassifier",
  "predictionSource": "AI_SERVICE",
  "predictionLabel": "FRAUD",
  "reviewStatus": "PENDING"
}
```

---

### Get Flagged Transactions

```http
GET /api/transactions/flagged
```

Returns only suspicious and fraud transactions.

---

### Get Transaction by ID

```http
GET /api/transactions/{id}
```

Example:

```http
GET /api/transactions/6
```

---

### Update Review Status

```http
PUT /api/transactions/{id}/review-status?status=UNDER_REVIEW
```

Example:

```http
PUT /api/transactions/6/review-status?status=CONFIRMED_FRAUD
```

Supported statuses:

```text
PENDING
UNDER_REVIEW
CONFIRMED_FRAUD
FALSE_POSITIVE
RESOLVED
```

---

### Dashboard Stats

```http
GET /api/dashboard/stats
```

Example response:

```json
{
  "totalTransactions": 6,
  "normalTransactions": 0,
  "suspiciousTransactions": 1,
  "fraudTransactions": 5,
  "pendingReviews": 3,
  "underReviewCases": 2,
  "confirmedFraudCases": 1,
  "totalFlaggedAmount": 1135000.0,
  "averageRiskScore": 89.0,
  "highRiskPercentage": 100.0
}
```

---

## AI Service Endpoints

### Root

```http
GET /
```

Example response:

```json
{
  "service": "FraudGuard AI Service",
  "status": "UP",
  "message": "AI service is running successfully"
}
```

---

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

---

### Prediction

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

Example response:

```json
{
  "prediction": "FRAUD",
  "risk_score": 97.0,
  "confidence": 0.97,
  "model_used": "RandomForestClassifier"
}
```

FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

---

## How to Run the Project

FraudGuard AI has three services that must run at the same time:

```text
AI Service:     http://localhost:8000
Backend:        http://localhost:8080
Frontend:       http://localhost:5173
```

---

## 1. Run the AI Service

Open a terminal:

```powershell
cd C:\Users\Administrator\Documents\fraudguard-ai\ai-service
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Open:

```text
http://localhost:8000/health
```

You should see:

```json
{
  "status": "UP",
  "service": "FraudGuard AI Service"
}
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

## 2. Run the Spring Boot Backend

Open another terminal:

```powershell
cd C:\Users\Administrator\Documents\fraudguard-ai\backend
cmd /c mvnw.cmd spring-boot:run
```

Open:

```text
http://localhost:8080/api/health
```

You should see:

```json
{
  "service": "FraudGuard AI Backend",
  "status": "UP",
  "message": "Backend is running successfully"
}
```

---

## 3. Run the React Frontend

Open another terminal:

```powershell
cd C:\Users\Administrator\Documents\fraudguard-ai\frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

The app should redirect to:

```text
http://localhost:5173/dashboard
```

---

## MySQL Configuration

The backend uses MySQL.

Create the database:

```sql
CREATE DATABASE fraudguard_ai;
```

Example Spring Boot configuration:

```properties
spring.application.name=backend

server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/fraudguard_ai?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

ai.service.url=http://localhost:8000
```

Important:

Do not push your real MySQL password to GitHub. Replace it with a placeholder or environment variable before pushing.

---

## AI Model Explanation

The AI service uses a Scikit-learn RandomForestClassifier.

The model uses transaction features such as:

- Transaction type
- Amount
- Old balance
- New balance
- Balance difference
- Amount-to-balance ratio
- Whether the transaction emptied the account

The model predicts whether a transaction is likely fraud or not.

Prediction categories:

```text
NORMAL
SUSPICIOUS
FRAUD
```

Risk score thresholds:

```text
0 - 39      NORMAL
40 - 69     SUSPICIOUS
70 - 100    FRAUD
```

---

## Sample Transaction

```json
{
  "transactionReference": "TXN-006",
  "customerId": "CUST-1006",
  "transactionType": "CASH_OUT",
  "amount": 300000,
  "oldBalance": 120000,
  "newBalance": 0,
  "destinationAccount": "ACC-9006"
}
```

Expected AI result:

```text
Prediction: FRAUD
Confidence: 97.0%
Source: AI_SERVICE
Model Used: RandomForestClassifier
```

---

## Frontend Pages

### Dashboard

```text
/dashboard
```

Main fraud monitoring overview.

### Transactions

```text
/transactions
```

Full transaction management table.

### Fraud Alerts

```text
/fraud-alerts
```

Suspicious and fraud-only alerts.

### Reports

```text
/reports
```

Fraud analytics and CSV export.

### Settings

```text
/settings
```

System settings and preferences.

---

## Screenshots

Add screenshots here after saving them in the docs folder.

Example:

```md
![Dashboard](docs/dashboard.png)
![Transactions](docs/transactions.png)
![Fraud Alerts](docs/fraud-alerts.png)
![Reports](docs/reports.png)
![Settings](docs/settings.png)
```

---

## Current Limitations

This project currently uses a small demo training dataset for the AI model.

For a production-level system, the model should be trained on a larger real-world fraud dataset with proper validation.

Other current limitations:

- Authentication is not fully implemented yet
- Settings are saved in localStorage
- No role-based access control yet
- No pagination yet
- No production deployment configuration yet
- No Docker setup finalized yet
- No user management yet

---

## Future Improvements

Planned improvements include:

- JWT authentication
- Role-based access control
- Real banking fraud dataset integration
- Model retraining pipeline
- Audit logs
- Pagination
- Transaction CSV upload
- PDF report export
- Email notifications
- Docker Compose setup
- Cloud deployment
- Backend settings API
- User management
- Model monitoring
- Fraud case notes
- Transaction detail modal

---

## Author

**Job Munyoki**
Full-stack developer focused on AI, cybersecurity, fintech systems, and data-driven applications.
