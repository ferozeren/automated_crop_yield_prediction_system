from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...model_service import predict

router = APIRouter(prefix="/api/irrigation", tags=["irrigation"])


class IrrigationRequest(BaseModel):
    Soil_Type: str
    Soil_pH: float
    Soil_Moisture: float
    Organic_Carbon: float
    Electrical_Conductivity: float
    Temperature_C: float
    Humidity: float
    Rainfall_mm: float
    Sunlight_Hours: float
    Wind_Speed_kmh: float
    Crop_Type: str
    Crop_Growth_Stage: str
    Season: str
    Irrigation_Type: str
    Water_Source: str
    Field_Area_hectare: float
    Mulching_Used: str
    Previous_Irrigation_mm: float
    Region: str

    model_config = {"extra": "forbid"}


@router.post("/predict")
def predict_irrigation(request: IrrigationRequest) -> dict[str, Any]:
    try:
        result = predict("irrigation_model.pkl", request.model_dump())
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return {"prediction": result}
