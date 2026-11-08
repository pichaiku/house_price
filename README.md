# House Price Prediction

This project estimates house prices per square meter based on the property's age, distance to an MRT station, and the number of nearby convenience stores. It includes a mobile application, a web application, and a REST API connected to a machine learning model.

## Screenshots

The screenshots below are ordered from the mobile application to the web application and show both the input form and prediction result. All screenshots show successful connections to the backend API.

### Mobile Application: Initial Form

Form for entering the property's age, distance to an MRT station, and number of nearby convenience stores.

<img src="docs/screenshots/mobile-home.png" alt="Mobile application initial state" width="560" height="400" style="object-fit: contain; background: #f5f5f5;" />

### Mobile Application: Prediction Result

Estimated price based on the user's input.

<img src="docs/screenshots/mobile-result.png" alt="Mobile application prediction result" width="560" height="400" style="object-fit: contain; background: #f5f5f5;" />

### Web Application: Initial Form

Web application form that uses the same inputs to estimate the price.

<img src="docs/screenshots/web-home.png" alt="Web application initial state" width="560" height="400" style="object-fit: contain; background: #f5f5f5;" />

### Web Application: Prediction Result

Estimated price displayed in the web application.

<img src="docs/screenshots/web-result.png" alt="Web application prediction result" width="560" height="400" style="object-fit: contain; background: #f5f5f5;" />

## System Overview

```text
User (Mobile / Web)
        │  POST /api/house
        ▼
Flask API :8000
        │  age, distance, minimart
        ▼
Linear Regression Model (.pkl)
        │
        ▼
Estimated price (THB/sq. m.)
```

## Features

- Accepts the property's age, distance to an MRT station, and number of nearby convenience stores.
- Validates input data types and value ranges.
- Estimates house prices using a Linear Regression model.
- Supports use through the mobile or web application.
- Displays prices in Thai baht per square meter.

## Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| Mobile | Flutter, Dart | Application for Android, iOS, Web, Windows, macOS, and Linux |
| Web | Next.js 15, React 19, TypeScript | Web-based price estimation form |
| Web styling | Tailwind CSS 4 | Web page layout and styling |
| API | Python, Flask, Flask-CORS | Receives input and returns predictions |
| Validation | Pydantic | Validates input types and ranges |
| ML | scikit-learn `LinearRegression` | Price prediction model |
| Data | pandas, NumPy | Reads and prepares data |
| Model persistence | joblib | Saves and loads the `.pkl` model |

## Project Structure

```text
house_price/
├── backend/
│   └── model/
│       ├── api.py                 # Flask REST API and request validation
│       ├── model.py               # Trains and exports the Linear Regression model
│       ├── house_price.csv        # Training and test dataset
│       ├── house_price_model.pkl  # Trained model
│       └── requirements.txt       # Backend Python dependencies
├── frontend/
│   ├── mobile/
│   │   ├── lib/main.dart          # Flutter application and API client
│   │   ├── pubspec.yaml           # Flutter dependencies
│   │   ├── test/                  # Widget tests
│   │   └── android/ ios/ macos/   # Platform-specific project files
│   └── web/
│       ├── src/app/page.tsx       # House price estimation form
│       ├── src/app/layout.tsx     # Next.js root layout and metadata
│       ├── src/app/globals.css    # Global styles
│       ├── public/                # Static assets
│       ├── package.json           # Web scripts and dependencies
│       └── next.config.ts         # Next.js configuration
├── docs/
│   └── screenshots/               # Screenshots used in this README
└── README.md
```

## Prediction Inputs

| Field | Type | Supported Range | Unit |
|---|---:|---:|---|
| `age` | integer | 0–120 | years |
| `distance` | integer | 0–10,000 | meters from an MRT station |
| `minimart` | integer | 0–20 | number of stores |

The model splits the data into a 70% training set and a 30% test set using `random_state=0`, then evaluates it with MAPE before exporting it as `house_price_model.pkl`. Predictions are estimates based on the dataset and do not represent actual transaction prices.

## Prerequisites

- Python 3.9 or later with `pip`
- Node.js and npm for the web application
- Flutter SDK for the mobile application
- An Android Emulator, iOS Simulator, or physical device to run the mobile application

## Installation and Running

Start the services in this order: backend API → mobile application → web application. Start the API before using either application so they can connect to it.

### 1. Backend API

```bash
cd backend/model
python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python api.py
```

On macOS/Linux, activate the virtual environment with `source .venv/bin/activate` instead of the Windows command.

The API runs at `http://127.0.0.1:8000`. `api.py` loads `house_price_model.pkl` from the current directory, so run the command from `backend/model` as shown.

### Train a New Model

If you update `house_price.csv` or want to create a new model, run `model.py` from the directory containing the dataset and model:

```bash
cd backend/model

# Activate the virtual environment first if it is not already active
# Windows PowerShell
.venv\Scripts\Activate.ps1

python model.py
```

The training process performs the following steps:

1. Reads data from `house_price.csv`.
2. Splits the data into a 70% training set and a 30% test set using `random_state=0`.
3. Trains the `LinearRegression` model.
4. Calculates MAPE and displays the result in the terminal.
5. Saves the new model as `house_price_model.pkl`.

The existing `house_price_model.pkl` file will be overwritten after successful training. Back it up first if you want to keep the previous model version. After training, restart the API so it loads the new model:

```bash
python api.py
```


### 2. Mobile Application

```bash
cd frontend/mobile
flutter pub get
flutter devices
flutter run
```

The mobile application calls the API at `http://127.0.0.1:8000/api/house`. If the API runs on a different server or IP address, update the address accordingly, for example:

```dart
Uri.parse('http://192.168.1.101:8000/api/house')
```

For the iOS Simulator or desktop, use a host that the target device can reach, and check the firewall if the connection fails.

### 3. Web Application

```bash
cd frontend/web
npm install
npm run dev
```

In Windows PowerShell, if the `npm` command is blocked by the execution policy, use `npm.cmd` instead, for example `npm.cmd install` and `npm.cmd run dev`.

Open [http://localhost:3000](http://localhost:3000), fill in all three fields, and click **Calculate Price**.

Commands for a production build:

```bash
npm run build
npm run start
```

The web application directly calls `POST http://127.0.0.1:8000/api/house`. If the backend runs on another machine or port, update the URL in `frontend/web/src/app/page.tsx`.

## Usage

1. Start the backend API on port `8000`.
2. Launch the mobile application with Flutter or open the web application on port `3000`.
3. Enter the property's age, distance to an MRT station, and number of nearby convenience stores in the mobile or web application.
4. Click **Calculate Price**.
5. View the estimated price in Thai baht per square meter.

## API Reference

### `GET /api/hello`

Check that the API is running:

```bash
curl http://127.0.0.1:8000/api/hello
```

Example response:

```json
{"message":"hello world"}
```

### `POST /api/house`

Request:

```json
{
  "age": 10,
  "distance": 850,
  "minimart": 3
}
```

Successful response:

```json
{
  "status": true,
  "price": 12345.67,
  "currency": "THB/sq. m."
}
```

The current API returns the currency label in Thai; the example above uses its English equivalent. If validation fails, the API returns HTTP `400` with details in `detail`, such as a negative value or a value outside the supported range.

## Notes

- The frontend currently defines the API URL in source code; there is no `.env` file or environment-based configuration.
- `CORS(app)` currently allows all origins. Restrict the allowed origins before deploying to production.
- Do not commit secrets or personal data to the repository.
- Load `.pkl` files only from trusted sources because deserialization can pose security risks.
