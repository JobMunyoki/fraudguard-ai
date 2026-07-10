from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import TransactionRequest, PredictionResponse
from app.model import predict_fraud


app = FastAPI(
    title="FraudGuard AI Service",
    description="Machine learning service for banking fraud detection",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "FraudGuard AI Service",
        "status": "UP",
        "message": "AI service is running successfully",
    }


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "FraudGuard AI Service",
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(transaction: TransactionRequest):
    result = predict_fraud(
        transaction_type=transaction.transaction_type,
        amount=transaction.amount,
        old_balance=transaction.old_balance,
        new_balance=transaction.new_balance,
    )

    return result
