import os
import joblib
import numpy as np


MODEL_PATH = os.path.join("models", "fraud_model.joblib")

TRANSACTION_TYPES = {
    "CASH_IN": 0,
    "CASH_OUT": 1,
    "DEBIT": 2,
    "PAYMENT": 3,
    "TRANSFER": 4,
}


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Model file not found. Run: python train_model.py"
        )

    return joblib.load(MODEL_PATH)


model = None


def get_model():
    global model

    if model is None:
        model = load_model()

    return model


def prepare_features(transaction_type: str, amount: float, old_balance: float, new_balance: float):
    transaction_type_encoded = TRANSACTION_TYPES.get(
        transaction_type.upper(), 3)

    balance_difference = old_balance - new_balance
    amount_to_old_balance_ratio = amount / old_balance if old_balance > 0 else 0
    emptied_account = 1 if new_balance == 0 else 0

    return np.array([[
        transaction_type_encoded,
        amount,
        old_balance,
        new_balance,
        balance_difference,
        amount_to_old_balance_ratio,
        emptied_account,
    ]])


def predict_fraud(transaction_type: str, amount: float, old_balance: float, new_balance: float):
    trained_model = get_model()

    features = prepare_features(
        transaction_type=transaction_type,
        amount=amount,
        old_balance=old_balance,
        new_balance=new_balance,
    )

    probability = trained_model.predict_proba(features)[0][1]
    risk_score = round(probability * 100, 2)

    if risk_score >= 70:
        prediction = "FRAUD"
    elif risk_score >= 40:
        prediction = "SUSPICIOUS"
    else:
        prediction = "NORMAL"

    return {
        "prediction": prediction,
        "risk_score": risk_score,
        "confidence": round(max(probability, 1 - probability), 4),
        "model_used": "RandomForestClassifier",
    }
