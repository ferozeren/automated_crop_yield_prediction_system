from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import importlib

from . import config
from .api.routes import crop, fertilizer, irrigation, price, weather

yield_route = importlib.import_module(".api.routes.yield", package=__package__)

app = FastAPI(title="Smart Agriculture API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|\[::1\]):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop.router)
app.include_router(fertilizer.router)
app.include_router(irrigation.router)
app.include_router(price.router)
app.include_router(yield_route.router)
app.include_router(weather.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
