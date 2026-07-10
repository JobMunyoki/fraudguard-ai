import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report


TRANSACTION_TYPES = {
    "CASH_IN": 0,
    "CASH_OUT": 1,
    "DEBIT": 2,
    "PAYMENT": 3,
    "TRANSFER": 4,
}


def build_training_data():
    data = [
        ["TRANSFER", 85000, 90000, 5000, 1],
        ["CASH_OUT", 150000, 100000, 0, 1],
        ["CASH_OUT", 200000, 100000, 0, 1],
        ["TRANSFER", 250000, 180000, 0, 1],
        ["CASH_OUT", 120000, 50000, 0, 1],
        ["TRANSFER", 175000, 100000, 0, 1],
        ["CASH_OUT", 90000, 70000, 0, 1],
        ["PAYMENT", 2500, 30000, 27500, 0],
        ["CASH_IN", 10000, 5000, 15000, 0],
        ["DEBIT", 3500, 20000, 16500, 0],
        ["PAYMENT", 1200, 8000, 6800, 0],
        ["TRANSFER", 5000, 60000, 55000, 0],
        ["CASH_OUT", 3000, 25000, 22000, 0],
        ["PAYMENT", 7000, 100000, 93000, 0],
        ["CASH_IN", 50000, 10000, 60000, 0],
        ["DEBIT", 9000, 45000, 36000, 0],
    ]

    df = pd.DataFrame(
        data,
        columns=[
            "transaction_type",
            "amount",
            "old_balance",
            "new_balance",
            "is_fraud",
        ],
    )

    df["transaction_type_encoded"] = df["transaction_type"].map(
        TRANSACTION_TYPES)
    df["balance_difference"] = df["old_balance"] - df["new_balance"]
    df["amount_to_old_balance_ratio"] = df.apply(
        lambda row: row["amount"] /
        row["old_balance"] if row["old_balance"] > 0 else 0,
        axis=1,
    )
    df["emptied_account"] = (df["new_balance"] == 0).astype(int)

    features = df[
        [
            "transaction_type_encoded",
            "amount",
            "old_balance",
            "new_balance",
            "balance_difference",
            "amount_to_old_balance_ratio",
            "emptied_account",
        ]
    ]

    target = df["is_fraud"]

    return features, target


def train():
    features, target = build_training_data()

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.25,
        random_state=42,
        stratify=target,
    )

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced",
    )

    model.fit(x_train, y_train)

    y_pred = model.predict(x_test)

    print("Model evaluation:")
    print(classification_report(y_test, y_pred))

    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/fraud_model.joblib")

    print("Model saved to models/fraud_model.joblib")


if __name__ == "__main__":
    train()
