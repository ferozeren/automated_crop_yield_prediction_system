# Smart Agriculture MLOps

Acreline is a local-first farm workspace for field records, weather data, and agricultural predictions.

The project combines a React and Vite interface with a FastAPI backend and five scikit-learn models:

- Crop recommendation
- Fertilizer recommendation
- Irrigation prediction
- Commodity price prediction
- Crop yield prediction

The interface supports field management, local field history, 13 languages, Indian state and city settings, live weather, JSON field import and export, and responsive desktop and mobile layouts.

## Stack

| Area        | Technology                         |
| ----------- | ---------------------------------- |
| Frontend    | React 18, Vite 5, i18next          |
| Backend     | FastAPI, Pydantic, Uvicorn         |
| Models      | scikit-learn 1.6.1, pandas, joblib |
| Environment | Python 3.12, uv, npm               |
| Weather     | OpenWeatherMap                     |
| Storage     | Browser localStorage               |

## Project layout

```text
backend/
  app/
    api/routes/       Prediction and weather endpoints
    models/           Serialized scikit-learn pipelines
    main.py           FastAPI application
    model_service.py  Shared model loading and prediction logic
data/                 Training CSV files
frontend/
  src/
    App.jsx           Application screens
    i18n.js           Translations
    regions.js        State and city configuration
    styles.css        Interface styles
ml/
  */                 Training and prediction scripts by model
.github/workflows/    Continuous integration and deployment workflows
docker-compose.yml
pyproject.toml
uv.lock
```

## Requirements

- Python 3.12
- uv
- Node.js 20 or newer
- npm
- An optional OpenWeatherMap API key

## Local setup

From the repository root:

```bash
uv sync
```

Start the backend:

```bash
uv run --package backend uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

The API documentation is available at `http://127.0.0.1:8000/docs`.

In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Weather configuration

Create `backend/.env`:

```env
OPENWEATHER_API_KEY=your_api_key
WEATHER_CITY=Hyderabad
```

Restart the backend after changing this file. If no API key is configured, the application continues to work for field records and model predictions, while the weather view reports that weather is unavailable.

Do not commit `backend/.env`. It is excluded by `.gitignore`.

## API endpoints

| Endpoint                  | Method | Purpose                      |
| ------------------------- | ------ | ---------------------------- |
| `/health`                 | GET    | Backend health check         |
| `/api/crop/recommend`     | POST   | Crop recommendation          |
| `/api/fertilizer/predict` | POST   | Fertilizer recommendation    |
| `/api/irrigation/predict` | POST   | Irrigation prediction        |
| `/api/price/predict`      | POST   | Commodity price prediction   |
| `/api/yield/predict`      | POST   | Yield prediction             |
| `/api/weather`            | GET    | Current weather and forecast |

Open `/docs` for request schemas and interactive examples.

## Docker

Create a root `.env` for Docker Compose:

```env
OPENWEATHER_API_KEY=your_api_key
WEATHER_CITY=Hyderabad
```

Then start both services:

```bash
docker compose up --build
```

The backend is available on port `8000` and the frontend on port `5173`.

## Retraining models

Model scripts are grouped in `ml/<model>/`.

```bash
uv run --package backend python ml/crop_recommendation/train.py
uv run --package backend python ml/fertilizer/train.py
uv run --package backend python ml/irrigation/train.py
uv run --package backend python ml/price_prediction/train.py
uv run --package backend python ml/yield_prediction/train.py
```

Each training script writes a `.pkl` pipeline to `backend/app/models/`.

## Frontend production build

```bash
cd frontend
npm run build
```

The generated files are written to `frontend/dist/`.
