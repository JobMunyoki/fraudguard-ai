from pydantic import BaseModel


class TransactionRequest(BaseModel):
    transaction_type: str
    amount: float
    old_balance: float
    new_balance: float


class PredictionResponse(BaseModel):
    prediction: str
    risk_score: float
    confidence: float
    model_used: str
