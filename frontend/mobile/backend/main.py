from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, Field, ValidationError
import joblib
import numpy as np

app = Flask(__name__)

CORS(app)

# Load the model once at startup
MODEL_PATH = "house_price_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# Pydantic model for input validation
class HouseFeatures(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Age of the house in years")
    distance: int = Field(..., ge=0, le=10000, description="Distance to the nearest MRT station in meters")
    minimart: int = Field(..., ge=0, le=20, description="Number of convenience stores in the vicinity")

@app.route("/api/hello", methods=["GET"])
def hello_world():
    return jsonify({"message": "hello world"})


@app.route("/api/house", methods=["POST"])
def predict_house_price():
    try:
        data = request.get_json()
        features = HouseFeatures(**data)

        x = np.array([[features.age, features.distance, features.minimart]])
        prediction = model.predict(x)

        return jsonify({
            "status": True,
            "price": round(float(prediction[0]*1000), 0),
            "currency": "THB"
        })

    except ValidationError as ve:
        errors = {}
        for error in ve.errors():
            field = error['loc'][0]
            msg = error['msg']
            errors.setdefault(field, []).append(msg)
        return jsonify({"status": False, "detail": errors}), 422

    except Exception as e:
        return jsonify({"status": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
