from supabase import create_client
import os
from datetime import datetime, timedelta
from functools import lru_cache
from pathlib import Path
import pickle

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


MODEL_PATH = Path(__file__).with_name("xgboost_model.pkl")
FEATURE_COLUMNS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Weekly_Total",
]
SUPABASE_URL = "https://luemjpymvwjlgbnctlby.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZW1qcHltdndqbGdibmN0bGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4OTgyMzMsImV4cCI6MjA5MTQ3NDIzM30.frr441ia8BeuFNUeBcMkHedqZm4xB6Zr0N43XMhMEho"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


class SalesInput(BaseModel):
    Mon: float = Field(..., ge=0)
    Tue: float = Field(..., ge=0)
    Wed: float = Field(..., ge=0)
    Thu: float = Field(..., ge=0)
    Fri: float = Field(..., ge=0)
    Sat: float = Field(..., ge=0)
    Sun: float = Field(..., ge=0)
    Weekly_Total: float = Field(..., ge=0)


@lru_cache
def load_model():
    try:
        with MODEL_PATH.open("rb") as model_file:
            return pickle.load(model_file)
    except FileNotFoundError as exc:
        raise RuntimeError(f"Model file not found: {MODEL_PATH}") from exc
    except ModuleNotFoundError as exc:
        missing_module = exc.name or "required dependency"
        raise RuntimeError(
            f"Cannot load model because `{missing_module}` is not installed."
        ) from exc


app = FastAPI(
    title="Sales Prediction API",
    description="FastAPI service for predictions using xgboost_model.pkl",
    version="1.0.0",
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "model_path": str(MODEL_PATH.name),
        "required_features": FEATURE_COLUMNS,
    }


@app.post("/predict")
def predict_sales(payload: SalesInput):
    try:
        model = load_model()
        input_frame = pd.DataFrame(
            [[getattr(payload, column) for column in FEATURE_COLUMNS]],
            columns=FEATURE_COLUMNS,
        )
        prediction = model.predict(input_frame)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Prediction failed: {exc}"
        ) from exc

    return {
        "prediction": float(prediction[0]),
        "features_used": payload.model_dump(),
    }


def get_last_7_days_sales():
    today = datetime.utcnow()

    week_data = {
        "Mon": 0, "Tue": 0, "Wed": 0,
        "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
    }

    seven_days_ago = (today - timedelta(days=7)).isoformat()

    response = (
        supabase.table("orders")
        .select("products, created_at, type")
        .gte("created_at", seven_days_ago)
        .eq("type", "sale")
        .execute()
    )

    data = response.data or []

    for row in data:
        try:
            date = datetime.fromisoformat(row["created_at"].replace("Z", ""))
            day = date.strftime("%a")

            products = row.get("products")

            # handle None
            if not products:
                continue

            # handle string JSON
            if isinstance(products, str):
                import json
                try:
                    products = json.loads(products)
                except:
                    continue

            # ensure list
            if not isinstance(products, list):
                continue

            for item in products:
                qty = item.get("qty", 0)
                week_data[day] += qty

        except Exception as e:
            print("Error processing row:", e)
            continue

    week_data["Weekly_Total"] = sum(week_data.values())

    return week_data



@app.get("/predict-auto")
def predict_auto():
    try:
        model = load_model()

        sales_data = get_last_7_days_sales()

        input_frame = pd.DataFrame(
            [[sales_data[col] for col in FEATURE_COLUMNS]],
            columns=FEATURE_COLUMNS,
        )

        prediction = model.predict(input_frame)

        return {
            "prediction": float(prediction[0]),
            "graph_data": [
                {"day": k, "sales": v}
                for k, v in sales_data.items()
                if k != "Weekly_Total"
            ],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))