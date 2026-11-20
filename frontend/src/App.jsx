import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.css";
import { STATE_LIST, getCitiesForState, getCapitalForState, STATE_LANGUAGE_MAP, REGION_COLORS, getRegionForState } from "./regions";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getEffectiveCity = () => {
  try {
    const city = localStorage.getItem("acreline:city");
    const state = localStorage.getItem("acreline:state");
    if (city && city !== "Not mentioned" && city.trim()) return city.trim();
    if (state) return getCapitalForState(state);
    return "Hyderabad";
  } catch { return "Hyderabad"; }
};

const getCurrentSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 6 && m <= 10) return "Kharif";
  if (m >= 11 || m <= 3) return "Rabi";
  return "Zaid";
};

const slides = [
  {
    eyebrow: "Field notes · 01",
    title: "Know what the field needs before it asks.",
    copy: "Soil, weather and crop readings in one place — no guesswork.",
    accent: "Soil to harvest",
    className: "hero-slide-one",
  },
  {
    eyebrow: "Plot record · 02",
    title: "Each crop gets its own reading.",
    copy: "Today's weather and soil readings, turned into one clear action.",
    accent: "What to do today",
    className: "hero-slide-two",
  },
  {
    eyebrow: "Season plan · 03",
    title: "Plan the season, not just the day.",
    copy: "Catch problems early, use less water, keep the soil working.",
    accent: "Kept by the field",
    className: "hero-slide-three",
  },
];

const tools = [
  { icon: "sprout", label: "Crop recommendation", service: "Crop recommendation", detail: "Match crop to soil", color: "mint" },
  { icon: "droplet", label: "Irrigation planner", service: "Irrigation prediction", detail: "Water only when it's needed", color: "blue" },
  { icon: "chart", label: "Yield forecast", service: "Yield prediction", detail: "Estimate the harvest early", color: "yellow" },
];

const services = [
  { icon: "sprout", title: "Crop recommendation", copy: "Match soil and rainfall to a crop that will actually thrive.", color: "mint" },
  { icon: "leaf", title: "Fertilizer recommendation", copy: "A nutrient plan built from your soil test and crop stage.", color: "violet" },
  { icon: "droplet", title: "Irrigation prediction", copy: "Read soil moisture and the forecast before you turn on the water.", color: "blue" },
  { icon: "chart", title: "Price prediction", copy: "See where the mandi price is heading before you sell.", color: "gold" },
  { icon: "chart", title: "Yield prediction", copy: "A working estimate of what this field will give you.", color: "orange" },
];

const serviceConfigs = {
  "Crop recommendation": {
    icon: "sprout", color: "mint", kicker: "CROP MATCH", title: "Pick a crop that fits this field.", copy: "Enter your soil nutrients and rainfall. We'll match them to crops that suit the season.",
    fields: [
      ["N", "Nitrogen (N)", "number", "90"], ["P", "Phosphorus (P)", "number", "42"], ["K", "Potassium (K)", "number", "43"],
      ["temperature", "Temperature (°C)", "number", "24"], ["humidity", "Humidity (%)", "number", "72"], ["ph", "Soil pH", "number", "6.5"], ["rainfall", "Rainfall (mm)", "number", "180"],
    ],
    result: "Rice", resultCopy: "fits this field's soil and rainfall.", confidence: "94%",
  },
  "Fertilizer recommendation": {
    icon: "leaf", color: "violet", kicker: "SOIL TEST READING", title: "Work out what the soil is missing.", copy: "Compare your soil values with what this crop needs at this stage.",
    fields: [
      ["Soil_Type", "Soil type", "select", "Loamy", ["Clay", "Loamy", "Sandy", "Silt"]],
      ["Soil_pH", "Soil pH", "number", "6.1"], ["Soil_Moisture", "Soil moisture (%)", "number", "35"], ["Organic_Carbon", "Organic carbon", "number", "0.42"],
      ["Electrical_Conductivity", "Electrical conductivity", "number", "1.87"], ["Nitrogen_Level", "Nitrogen level", "number", "61"], ["Phosphorus_Level", "Phosphorus level", "number", "44"], ["Potassium_Level", "Potassium level", "number", "84"],
      ["Temperature", "Temperature (°C)", "number", "19.84"], ["Humidity", "Humidity (%)", "number", "83.31"], ["Rainfall", "Rainfall (mm)", "number", "1693.22"],
      ["Crop_Type", "Crop type", "select", "Cotton", ["Cotton", "Maize", "Potato", "Rice", "Sugarcane", "Tomato", "Wheat"]], ["Crop_Growth_Stage", "Growth stage", "select", "Vegetative", ["Flowering", "Harvest", "Sowing", "Vegetative"]], ["Season", "Season", "select", "Kharif", ["Kharif", "Rabi", "Zaid"]],
      ["Irrigation_Type", "Irrigation type", "select", "Canal", ["Canal", "Drip", "Rainfed", "Sprinkler"]], ["Previous_Crop", "Previous crop", "select", "Wheat", ["Cotton", "Maize", "Potato", "Rice", "Sugarcane", "Tomato", "Wheat"]], ["Region", "Region", "select", "South", ["Central", "East", "North", "South", "West"]],
      ["Fertilizer_Used_Last_Season", "Fertilizer last season (kg/ha)", "number", "297.15"], ["Yield_Last_Season", "Yield last season (t/ha)", "number", "1.19"],
    ],
    result: "MOP", resultCopy: "is what this crop needs at this stage.", confidence: "91%",
  },
  "Irrigation prediction": {
    icon: "droplet", color: "blue", kicker: "WATER NEED", title: "Check whether the field needs water today.", copy: "Moisture, forecast and crop stage decide whether to irrigate.",
    fields: [
      ["Soil_Type", "Soil type", "select", "Clay", ["Clay", "Loamy", "Sandy", "Silt"]], ["Soil_pH", "Soil pH", "number", "6.1"], ["Soil_Moisture", "Soil moisture (%)", "number", "36"],
      ["Organic_Carbon", "Organic carbon", "number", "0.42"], ["Electrical_Conductivity", "Electrical conductivity", "number", "2.17"],
      ["Temperature_C", "Temperature (°C)", "number", "21.9"], ["Humidity", "Humidity (%)", "number", "31"], ["Rainfall_mm", "Rainfall (mm)", "number", "1167"], ["Sunlight_Hours", "Sunlight hours", "number", "4"],
      ["Wind_Speed_kmh", "Wind speed (km/h)", "number", "1.97"], ["Crop_Type", "Crop type", "select", "Wheat", ["Cotton", "Maize", "Potato", "Rice", "Sugarcane", "Wheat"]], ["Crop_Growth_Stage", "Growth stage", "select", "Vegetative", ["Flowering", "Harvest", "Sowing", "Vegetative"]], ["Season", "Season", "select", "Rabi", ["Kharif", "Rabi", "Zaid"]], ["Irrigation_Type", "Irrigation type", "select", "Rainfed", ["Canal", "Drip", "Rainfed", "Sprinkler"]], ["Water_Source", "Water source", "select", "Reservoir", ["Groundwater", "Rainwater", "Reservoir", "River"]], ["Field_Area_hectare", "Field area (hectares)", "number", "4.73"], ["Mulching_Used", "Mulching used", "select", "Yes", ["Yes", "No"]], ["Previous_Irrigation_mm", "Previous irrigation (mm)", "number", "1.98"], ["Region", "Region", "select", "South", ["Central", "East", "North", "South", "West"]],
    ],
    result: "Low", resultCopy: "irrigation need today. Hold off for now.", confidence: "88%",
  },
  "Price prediction": {
    icon: "chart", color: "gold", kicker: "MANDI READING", title: "Decide when to take it to market.", copy: "Commodity, district and recent movement go into the price estimate.",
    fields: [
      ["month", "Forecast month", "month", "2025-03"], ["commodity_name", "Commodity", "select", "Maize", ["Barley (Jau)", "Coconut", "Coffee", "Cotton", "Ginger(Dry)", "Groundnut", "Jowar(Sorghum)", "Maize", "Millets", "Rice", "Sugar", "Sugarcane", "Sunflower", "Tea", "Turmeric", "Wheat"]], ["state_name", "State", "select", "India", ["India"]], ["district_name", "District", "select", "All", ["All"]],
      ["avg_min_price", "Average minimum price (₹)", "number", "2191.23"], ["avg_max_price", "Average maximum price (₹)", "number", "2402.98"], ["calculationType", "Calculation type", "select", "Monthly", ["Monthly"]], ["change", "Recent change (%)", "number", "-14.43"],
    ],
    result: "₹2,475", resultCopy: "estimated modal price for next month.", confidence: "86%",
  },
  "Yield prediction": {
    icon: "chart", color: "orange", kicker: "YIELD ESTIMATE", title: "Estimate what this field will yield.", copy: "Crop, area, planting date and inputs set the estimate.",
    fields: [
      ["Crop Type", "Crop type", "select", "Soybean", ["Cotton", "Groundnut", "Maize", "Onion", "Potato", "Rice", "Soybean", "Sugarcane", "Wheat"]], ["Field Size (hectares)", "Field size (hectares)", "number", "1.04"], ["Planting Date", "Planting date", "date", "2025-06-08"],
      ["Soil Type", "Soil type", "select", "Loamy", ["Alluvial", "Chalky", "Clay", "Laterite", "Loamy", "Peaty", "Sandy", "Silty"]], ["Fertilizer Used", "Fertilizer used", "select", "Urea", ["Ammonium Sulphate", "Biofertilizers", "Compost/Organic Manure", "Dap", "Mop", "Npk", "Urea"]], ["Irrigation Type", "Irrigation type", "select", "Furrow/Canal Irrigation", ["Drip Irrigation", "Flood Irrigation", "Furrow/Canal Irrigation", "Rainfed", "Sprinkler Irrigation"]],
    ],
    result: "1.46 t/ha", resultCopy: "estimated yield for this field.", confidence: "89%",
  },
};

function Icon({ name, size = 20 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    sprout: <><path d="M12 21V11" /><path d="M12 15c-3.8 0-6-2.2-6-6 3.8 0 6 2.2 6 6Z" /><path d="M12 12c0-3.8 2.2-6 6-6 0 3.8-2.2 6-6 6Z" /></>,
    droplet: <path d="M12 3.5S5.8 10.1 5.8 14.7a6.2 6.2 0 0 0 12.4 0C18.2 10.1 12 3.5 12 3.5Z" />,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 3-4 3 2 5-6" /></>,
    leaf: <><path d="M20 4C10 4 4 8 4 15c0 3 2 5 5 5 7 0 11-6 11-16Z" /><path d="M4 20c3-5 7-8 12-10" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L7.3 8l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19 8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function ServicePage({ serviceName, onBack, showNotice, prefillField, weather }) {
  const config = serviceConfigs[serviceName];
  const getInitial = () => {
    const base = Object.fromEntries(config.fields.map(([key, , , value]) => [key, value]));
    if (prefillField) {
      const agro = prefillField.agronomy || {};
      for (const k of Object.keys(base)) if (agro[k] != null) base[k] = String(agro[k]);
      if (serviceName === "Yield prediction") {
        base["Crop Type"] = prefillField.crop || base["Crop Type"];
        base["Soil Type"] = prefillField.soil || base["Soil Type"];
        const ha = prefillField.areaUnit === "ha" ? String(prefillField.areaValue) : (parseFloat(prefillField.areaValue) * 0.404686).toFixed(2);
        base["Field Size (hectares)"] = ha;
        if (prefillField.plantingDate) base["Planting Date"] = prefillField.plantingDate;
      }
      if (serviceName === "Fertilizer recommendation") {
        base["Soil_Type"] = prefillField.soil || base["Soil_Type"];
        base["Crop_Type"] = prefillField.crop || base["Crop_Type"];
      }
      if (serviceName === "Irrigation prediction") {
        base["Soil_Type"] = prefillField.soil || base["Soil_Type"];
        base["Crop_Type"] = prefillField.crop || base["Crop_Type"];
        const ha = prefillField.areaUnit === "ha" ? String(prefillField.areaValue) : (parseFloat(prefillField.areaValue) * 0.404686).toFixed(2);
        base["Field_Area_hectare"] = ha;
      }
      const useLive = prefillField.useLiveWeather && weather?.current;
      if (useLive) {
        if (base["Temperature"] != null) base["Temperature"] = String(weather?.current?.temperature);
        if (base["Temperature_C"] != null) base["Temperature_C"] = String(weather?.current?.temperature);
        if (base["Humidity"] != null) base["Humidity"] = String(weather?.current?.humidity);
        if (base["Rainfall"] != null) base["Rainfall"] = String(weather?.current?.rain_probability);
        if (base["Rainfall_mm"] != null) base["Rainfall_mm"] = String((weather?.current?.rain_probability * 10).toFixed(1));
        if (base["temperature"] != null) base["temperature"] = String(weather?.current?.temperature);
        if (base["humidity"] != null) base["humidity"] = String(weather?.current?.humidity);
        if (base["rainfall"] != null) base["rainfall"] = String(weather?.current?.rain_probability);
      }
    }
    return base;
  };
  const [useLive, setUseLive] = useState(!!prefillField?.useLiveWeather);
  const [values, setValues] = useState(getInitial());
  useEffect(() => { setValues(getInitial()); setUseLive(!!prefillField?.useLiveWeather); }, [serviceName, prefillField]);
  useEffect(() => {
    if (!weather) return;
    if (!useLive) return;
    setValues((prev) => {
      const next = { ...prev };
      if (next["Temperature"] != null) next["Temperature"] = String(weather?.current?.temperature);
      if (next["Temperature_C"] != null) next["Temperature_C"] = String(weather?.current?.temperature);
      if (next["Humidity"] != null) next["Humidity"] = String(weather?.current?.humidity);
      if (next["Rainfall"] != null) next["Rainfall"] = String(weather?.current?.rain_probability);
      if (next["Rainfall_mm"] != null) next["Rainfall_mm"] = String((weather?.current?.rain_probability * 10).toFixed(1));
      if (next["temperature"] != null) next["temperature"] = String(weather?.current?.temperature);
      if (next["humidity"] != null) next["humidity"] = String(weather?.current?.humidity);
      if (next["rainfall"] != null) next["rainfall"] = String(weather?.current?.rain_probability);
      return next;
    });
  }, [weather, useLive]);
  const [submitted, setSubmitted] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitted(false);
    setPrediction(null);
    setError("");
  };

  const submitPrediction = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpointByService = {
      "Crop recommendation": "/api/crop/recommend",
      "Fertilizer recommendation": "/api/fertilizer/predict",
      "Irrigation prediction": "/api/irrigation/predict",
      "Price prediction": "/api/price/predict",
      "Yield prediction": "/api/yield/predict",
    };
    const payload = { ...values };
    if (serviceName === "Yield prediction") {
      Object.assign(payload, {
        Crop_Type: payload["Crop Type"],
        Field_Size_hectares: payload["Field Size (hectares)"],
        Planting_Date: payload["Planting Date"],
        Soil_Type: payload["Soil Type"],
        Fertilizer_Used: payload["Fertilizer Used"],
        Irrigation_Type: payload["Irrigation Type"],
      });
      ["Crop Type", "Field Size (hectares)", "Planting Date", "Soil Type", "Fertilizer Used", "Irrigation Type"].forEach((key) => delete payload[key]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpointByService[serviceName]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        let detail = data.detail;
        if (Array.isArray(detail)) detail = detail.map((d) => d.msg || `${d.loc?.join(".")}: ${d.type}`).join(", ");
        else if (typeof detail === "object" && detail !== null) detail = JSON.stringify(detail);
        throw new Error(detail || `Request failed (${response.status})`);
      }
      setPrediction(data.prediction);
      setSubmitted(true);
      try {
        const key = `acreline:history:${serviceName}`;
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        localStorage.setItem(key, JSON.stringify([{ ts: new Date().toISOString(), prediction: data.prediction, field: prefillField?.name || null }, ...prev].slice(0, 20)));
      } catch {}
      if (prefillField?.id) {
        try {
          const raw = localStorage.getItem("acreline:fields");
          if (raw) {
            const fieldsArr = JSON.parse(raw);
            const idx = fieldsArr.findIndex((f) => f.id === prefillField.id);
            if (idx !== -1) {
              fieldsArr[idx].predictions = fieldsArr[idx].predictions || {};
              const arr = fieldsArr[idx].predictions[serviceName] || [];
              arr.unshift({ ts: new Date().toISOString(), prediction: data.prediction, inputs: values });
              fieldsArr[idx].predictions[serviceName] = arr.slice(0, 5);
              fieldsArr[idx].updatedAt = new Date().toISOString();
              localStorage.setItem("acreline:fields", JSON.stringify(fieldsArr));
              localStorage.setItem("acreline:fields:v2", JSON.stringify(fieldsArr));
            }
          }
        } catch {}
      }
      showNotice(`${serviceName} finished${prefillField ? ` for ${prefillField.name}` : ""}`);
    } catch (requestError) {
      const msg = requestError.message?.includes("Failed to fetch") ? `Cannot reach the model service at ${API_BASE_URL} — check the backend.` : requestError.message;
      setError(msg);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-page">
      <button className="back-button" onClick={onBack}><Icon name="arrow" size={16} /> Back to farm</button>
      <section className="service-page-header">
        <div className={`service-page-icon ${config.color}`}><Icon name={config.icon} size={29} /></div>
        <div><span className="section-kicker">{config.kicker}</span><h1>{config.title}</h1><p>{config.copy}</p></div>
      </section>
      {prefillField && <div style={{ background: "#e8e2d2", border: "1px solid var(--rule)", padding: "10px 14px", borderRadius: 2, fontSize: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span style={{ background: "var(--sheet)", padding: "4px 8px", borderRadius: 2, fontWeight: 700, fontSize: 10 }}>FIELD</span><b>{prefillField.name}</b>· {prefillField.crop} · {prefillField.soil} · {prefillField.areaValue} {prefillField.areaUnit} <button onClick={onBack} style={{ marginLeft: "auto", background: "transparent", border: 0, color: "var(--clay)", fontSize: 11 }}>Clear field</button></div>}
      {(serviceName === "Fertilizer recommendation" || serviceName === "Irrigation prediction" || serviceName === "Crop recommendation") && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--paper)", padding: "8px 10px", borderRadius: 2, fontSize: 12, marginBottom: 12, border: "1px solid var(--rule)" }}>
          <input type="checkbox" checked={useLive} onChange={(e) => setUseLive(e.target.checked)} />
          Pull live weather for temperature, humidity and rainfall {weather ? `(${weather?.current?.temperature}°C, ${weather?.current?.humidity}%, ${weather?.current?.rain_probability}% rain)` : "(loading...)"} — untick to enter values by hand {prefillField ? "(field record)" : "(defaults)"}
          {!weather && useLive && <span style={{ color: "var(--clay)" }}> — no weather feed, using entered values</span>}
        </label>
      )}
      <div className="service-layout">
        <form className="input-card" onSubmit={submitPrediction}>
          <div className="input-card-heading"><div><span className="section-kicker">FIELD READINGS</span><h2>Enter the field readings</h2></div><span className="step-count">ONE STEP</span></div>
          <div className="service-form-grid">{config.fields.map(([key, label, type, value, options]) => {
            const isLiveField = useLive && ["Temperature", "Temperature_C", "Humidity", "Rainfall", "Rainfall_mm", "temperature", "humidity", "rainfall"].includes(key);
            return <label className="field-label" key={key} style={isLiveField ? { opacity: 0.7 } : {}}>{label}{isLiveField && <span style={{ fontSize: 9, color: "var(--olive)", marginLeft: 6 }}>LIVE</span>}{type === "select" ? <select value={values[key]} onChange={(event) => updateValue(key, event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input type={type} value={values[key]} onChange={(event) => updateValue(key, event.target.value)} required readOnly={isLiveField} style={isLiveField ? { background: "#e8e2d2" } : {}} />}</label>;
          })}</div>
          <button className="primary-service-button" type="submit" disabled={loading}>{loading ? "Running..." : `Run ${serviceName.toLowerCase()}`} {!loading && <Icon name="arrow" size={17} />}</button>
          {error && <p className="form-error">{error}</p>}
        </form>
        <aside className={`service-result ${submitted ? "result-ready" : ""}`}>
          <span className="result-label">READING · {config.kicker}</span>
          <div className="result-orb"><Icon name={config.icon} size={34} /></div>
          <p className="result-intro">{submitted ? "Reading ready" : "Reading will appear here"}</p>
          <strong>{submitted ? (serviceName === "Price prediction" ? `₹${Number(prediction).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : serviceName === "Yield prediction" ? `${Number(prediction).toFixed(2)} t/ha` : prediction) : "— —"}</strong>
          <p>{submitted ? config.resultCopy : "Enter the readings above to get a result."}</p>
          <div className="confidence"><span>Model confidence</span><b>{submitted ? config.confidence : "—"}</b><i><em style={{ width: submitted ? config.confidence : "8%" }} /></i></div>
          <small className="frontend-note">From the trained model, using live inputs</small>
        </aside>
      </div>
    </div>
  );
}

function WorkspacePage({ page, onOpenService, showNotice }) {
  const { t: wt, i18n: wi18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(() => { try { return JSON.parse(localStorage.getItem("acreline:settings:notifications") ?? "true"); } catch { return true; } });
  const [units, setUnits] = useState(() => { try { return JSON.parse(localStorage.getItem("acreline:settings:units") ?? '"Metric"'); } catch { return "Metric"; } });
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const weatherApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  useEffect(() => { try { localStorage.setItem("acreline:settings:notifications", JSON.stringify(notifications)); } catch {} }, [notifications]);
  useEffect(() => { try { localStorage.setItem("acreline:settings:units", JSON.stringify(units)); } catch {} }, [units]);
  const defaultAgronomy = { Soil_pH: 6.1, Soil_Moisture: 35, Organic_Carbon: 0.42, Electrical_Conductivity: 1.87, Nitrogen_Level: 61, Phosphorus_Level: 44, Potassium_Level: 84, Temperature: 19.84, Humidity: 83.31, Rainfall: 1693.22, Crop_Growth_Stage: "Vegetative", Season: "Kharif", Irrigation_Type: "Canal", Previous_Crop: "Wheat", Region: "South", Fertilizer_Used_Last_Season: 297.15, Yield_Last_Season: 1.19, Temperature_C: 21.9, Rainfall_mm: 1167, Sunlight_Hours: 4, Wind_Speed_kmh: 1.97, Water_Source: "Reservoir", Mulching_Used: "Yes", Previous_Irrigation_mm: 1.98 };
  const toneForCrop = (crop) => crop === "Wheat" ? "green" : crop === "Rice" ? "amber" : crop === "Cotton" ? "blue" : crop === "Maize" ? "green" : "amber";
  const toFieldObj = (arr) => {
    if (arr && typeof arr === "object" && !Array.isArray(arr) && arr.id) {
      if (!arr.agronomy) arr.agronomy = { ...defaultAgronomy };
      if (arr.useLiveWeather == null) arr.useLiveWeather = false;
      if (!arr.predictions) arr.predictions = {};
      return arr;
    }
    if (Array.isArray(arr)) {
      const [name, crop, areaStr, status, tone, soil] = arr;
      const areaValue = parseFloat(areaStr) || 12.5;
      const areaUnit = areaStr?.includes("ha") ? "ha" : "ac";
      return { id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, name, crop, areaValue, areaUnit, soil: soil || "Loamy", status: status || "Growing well", tone: tone || toneForCrop(crop), plantingDate: new Date().toISOString().slice(0, 10), notes: "", agronomy: { ...defaultAgronomy }, useLiveWeather: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), predictions: {} };
    }
    return null;
  };
  const [fields, setFields] = useState(() => {
    try {
      const raw = localStorage.getItem("acreline:fields");
      if (raw) {
        const parsed = JSON.parse(raw);
        const migrated = parsed.map(toFieldObj).filter(Boolean);
        const legacy = localStorage.getItem("acreline:fields:v2");
        if (!legacy) localStorage.setItem("acreline:fields:v2", JSON.stringify(migrated));
        return migrated;
      }
      return [["North field", "Wheat", "32.6 ac", "Growing well", "green", "Loamy"], ["River bend", "Rice", "24.8 ac", "Needs attention", "amber", "Clay"], ["Orchard block", "Cotton", "21.0 ac", "Ready for harvest", "blue", "Sandy"]].map(toFieldObj);
    } catch { return [["North field", "Wheat", "32.6 ac", "Growing well", "green", "Loamy"], ["River bend", "Rice", "24.8 ac", "Needs attention", "amber", "Clay"], ["Orchard block", "Cotton", "21.0 ac", "Ready for harvest", "blue", "Sandy"]].map(toFieldObj); }
  });
  useEffect(() => { try { const toStore = fields.map((f) => f.id ? f : toFieldObj(f)).filter(Boolean); localStorage.setItem("acreline:fields", JSON.stringify(toStore)); localStorage.setItem("acreline:fields:v2", JSON.stringify(toStore)); } catch {} }, [fields]);
  const [showAddField, setShowAddField] = useState(false);
  const [showAgronomy, setShowAgronomy] = useState(false);
  const [showEditAgronomy, setShowEditAgronomy] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newField, setNewField] = useState({ name: "", crop: "Wheat", areaValue: "12.5", areaUnit: "ac", soil: "Loamy", status: "Growing well", plantingDate: new Date().toISOString().slice(0, 10), notes: "", agronomy: { ...defaultAgronomy }, useLiveWeather: false });
  const [editField, setEditField] = useState(null);
  const [fieldError, setFieldError] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterCrop, setFilterCrop] = useState("All fields");
  const [tasks, setTasks] = useState(() => { try { const raw = localStorage.getItem("acreline:tasks"); return raw ? JSON.parse(raw) : ["Check River bend moisture", "Review fertilizer plan", "Schedule harvest window"]; } catch { return ["Check River bend moisture", "Review fertilizer plan", "Schedule harvest window"]; } });
  useEffect(() => { try { localStorage.setItem("acreline:tasks", JSON.stringify(tasks)); } catch {} }, [tasks]);
  const [settingsLang, setSettingsLang] = useState(() => { try { return localStorage.getItem("acreline:language") || "en"; } catch { return "en"; } });
  const [settingsState, setSettingsState] = useState(() => { try { return localStorage.getItem("acreline:state") || ""; } catch { return ""; } });
  const [settingsCity, setSettingsCity] = useState(() => { try { return localStorage.getItem("acreline:city") || ""; } catch { return ""; } });
  const [settingsCitySearch, setSettingsCitySearch] = useState("");
  const [settingsCustomCity, setSettingsCustomCity] = useState(false);

  useEffect(() => {
    if (page === "My fields") {
      try { const raw = localStorage.getItem("acreline:fields"); if (raw) setFields(JSON.parse(raw).map(toFieldObj).filter(Boolean)); } catch {}
    }
  }, [page]);

  useEffect(() => {
    if (page !== "Weather station") return undefined;
    const city = getEffectiveCity();
    const state = (() => { try { return localStorage.getItem("acreline:state") || ""; } catch { return ""; } })();
    const query = city ? `${city}${state ? `,${state}` : ""}` : "Hyderabad";
    const cacheKey = `acreline:weather:${query}`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && cached.ts && Date.now() - cached.ts < 10 * 60 * 1000) {
        setWeather(cached.data);
        setWeatherLoading(false);
        return;
      }
    } catch {}
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError("");
    fetch(`${weatherApiUrl}/api/weather?city=${encodeURIComponent(query)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to load weather.");
        return data;
      })
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data })); } catch {}
        }
      })
      .catch((error) => {
        if (!cancelled) setWeatherError(error.message);
      })
      .finally(() => {
        if (!cancelled) setWeatherLoading(false);
      });
    return () => { cancelled = true; };
  }, [page, weatherApiUrl]);
  const filteredFields = fields
    .filter((f) => `${f.name} ${f.crop}`.toLowerCase().includes(search.toLowerCase()) && (filterCrop === "All fields" || f.crop === filterCrop))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "area") return b.areaValue - a.areaValue;
      if (sortBy === "crop") return a.crop.localeCompare(b.crop);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const validateField = (data, excludeId = null) => {
    if (!data.name.trim()) return "Field name is required";
    if (data.name.trim().length > 50) return "Field name must be ≤50 chars";
    if (fields.some((f) => f.id !== excludeId && f.name.toLowerCase() === data.name.trim().toLowerCase())) return `Field "${data.name.trim()}" already exists`;
    const area = parseFloat(data.areaValue);
    if (isNaN(area) || area < 0.01 || area > 10000) return "Area must be 0.01–10000";
    return "";
  };
  const handleAddField = (e) => {
    e.preventDefault();
    const err = validateField(newField);
    if (err) { setFieldError(err); return; }
    setFieldError("");
    const entry = { id: (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), name: newField.name.trim(), crop: newField.crop, areaValue: parseFloat(newField.areaValue), areaUnit: newField.areaUnit, soil: newField.soil, status: newField.status, tone: toneForCrop(newField.crop), plantingDate: newField.plantingDate, notes: newField.notes, agronomy: { ...newField.agronomy }, useLiveWeather: !!newField.useLiveWeather, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), predictions: {} };
    setFields((prev) => [...prev, entry]);
    setNewField({ name: "", crop: "Wheat", areaValue: "12.5", areaUnit: "ac", soil: "Loamy", status: "Growing well", plantingDate: new Date().toISOString().slice(0, 10), notes: "", agronomy: { ...defaultAgronomy }, useLiveWeather: false });
    setShowAddField(false);
    setShowAgronomy(false);
    showNotice(`Field "${entry.name}" added${entry.useLiveWeather ? " · live weather" : ""}`);
  };
  const handleUpdateField = (e) => {
    e.preventDefault();
    if (!editingField) return;
    const err = validateField(editField, editingField.id);
    if (err) { setFieldError(err); return; }
    setFieldError("");
    setFields((prev) => prev.map((f) => f.id === editingField.id ? { ...f, name: editField.name.trim(), crop: editField.crop, areaValue: parseFloat(editField.areaValue), areaUnit: editField.areaUnit, soil: editField.soil, status: editField.status, plantingDate: editField.plantingDate, notes: editField.notes, agronomy: { ...editField.agronomy }, useLiveWeather: !!editField.useLiveWeather, tone: toneForCrop(editField.crop), updatedAt: new Date().toISOString() } : f));
    setEditingField(null);
    setSelectedField(null);
    setShowEditAgronomy(false);
    showNotice(`Field "${editField.name.trim()}" updated${editField.useLiveWeather ? " · live weather" : ""}`);
  };
  const handleDeleteField = (field) => {
    if (!confirm(`Delete field "${field.name}"? This cannot be undone.`)) return;
    setFields((prev) => prev.filter((f) => f.id !== field.id));
    setSelectedField(null);
    setEditingField(null);
    showNotice(`Field "${field.name}" removed`);
  };
  const exportFields = () => {
    const data = JSON.stringify(fields, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `acreline-fields-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
    showNotice("Fields exported");
  };
  const importFields = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        const arr = Array.isArray(imported) ? imported : [imported];
        const valid = arr.map(toFieldObj).filter(Boolean);
        if (!valid.length) throw new Error("No valid fields");
        setFields((prev) => [...prev, ...valid]);
        showNotice(`Imported ${valid.length} fields`);
      } catch (err) { showNotice("Import failed: " + err.message); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (page === "My fields") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">FIELD RECORDS</span><h1>Every field you track, with its readings.</h1><p>{fields.length} fields · {fields.filter((f) => f.status === "Growing well").length} growing · {getCurrentSeason()} · saved on this device.</p></div><div style={{ display: "flex", gap: 8 }}><label className="filter-button" style={{ cursor: "pointer" }}>Import<input type="file" accept=".json" onChange={importFields} style={{ display: "none" }} /></label><button className="filter-button" onClick={exportFields}>Export</button><button className="primary-small" onClick={() => { setShowAddField((v) => !v); setEditingField(null); setFieldError(""); }}><Icon name="plus" size={16} /> {showAddField ? "Close" : "Add field"}</button></div></div>
      {showAddField && (
        <form onSubmit={handleAddField} className="settings-card" style={{ marginBottom: 16, padding: "16px 23px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="field-label">Field name<input value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} placeholder="e.g. South ridge" maxLength={50} required /></label>
            <label className="field-label">Crop<select value={newField.crop} onChange={(e) => setNewField({ ...newField, crop: e.target.value })}><option>Wheat</option><option>Rice</option><option>Cotton</option><option>Maize</option><option>Soybean</option><option>Groundnut</option></select></label>
            <label className="field-label">Area<input type="number" value={newField.areaValue} onChange={(e) => setNewField({ ...newField, areaValue: e.target.value })} min="0.01" max="10000" step="0.1" required /></label>
            <label className="field-label">Unit<select value={newField.areaUnit} onChange={(e) => setNewField({ ...newField, areaUnit: e.target.value })}><option value="ac">ac</option><option value="ha">ha</option></select></label>
            <label className="field-label">Soil<select value={newField.soil} onChange={(e) => setNewField({ ...newField, soil: e.target.value })}><option>Loamy</option><option>Clay</option><option>Sandy</option><option>Silt</option><option>Alluvial</option><option>Chalky</option><option>Laterite</option><option>Peaty</option><option>Silty</option></select></label>
            <label className="field-label">Status<select value={newField.status} onChange={(e) => setNewField({ ...newField, status: e.target.value })}><option>Growing well</option><option>Needs attention</option><option>Ready for harvest</option><option>Planted</option></select></label>
            <label className="field-label">Planting date<input type="date" value={newField.plantingDate} onChange={(e) => setNewField({ ...newField, plantingDate: e.target.value })} /></label>
            <label className="field-label">Notes<input value={newField.notes} onChange={(e) => setNewField({ ...newField, notes: e.target.value })} placeholder="Optional" maxLength={120} /></label>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12, background: "var(--paper)", padding: "8px 10px", borderRadius: 2 }}><input type="checkbox" checked={!!newField.useLiveWeather} onChange={(e) => setNewField({ ...newField, useLiveWeather: e.target.checked })} /> Pull live weather for temperature, humidity and rainfall {weather ? `(${weather?.current?.temperature}°C, ${weather?.current?.humidity}%, ${weather?.current?.rain_probability}% rain)` : "(loading...)"} — untick to enter values by hand</label>
          <button type="button" className="filter-button" style={{ marginTop: 8 }} onClick={() => setShowAgronomy((v) => !v)}>{showAgronomy ? "Hide soil readings" : "Show soil readings (13) — N/P/K, pH, EC…"}</button>
          {showAgronomy && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
              {[
                ["Soil_pH", "Soil pH", "6.1"], ["Soil_Moisture", "Soil moisture (%)", "35"], ["Organic_Carbon", "OC", "0.42"],
                ["Electrical_Conductivity", "EC", "1.87"], ["Nitrogen_Level", "N", "61"], ["Phosphorus_Level", "P", "44"], ["Potassium_Level", "K", "84"],
                ["Temperature", "Temp (°C)", "19.84"], ["Humidity", "Humidity (%)", "83.31"], ["Rainfall", "Rainfall (mm)", "1693.22"],
                ["Crop_Growth_Stage", "Growth stage", "Vegetative"], ["Season", "Season", "Kharif"], ["Region", "Region", "South"],
              ].map(([key, label, ph]) => (
                <label key={key} className="field-label">{label}<input value={newField.agronomy[key] ?? ph} onChange={(e) => setNewField({ ...newField, agronomy: { ...newField.agronomy, [key]: e.target.value } })} placeholder={ph} /></label>
              ))}
              <label className="field-label">Irrigation<select value={newField.agronomy.Irrigation_Type} onChange={(e) => setNewField({ ...newField, agronomy: { ...newField.agronomy, Irrigation_Type: e.target.value } })}><option>Canal</option><option>Drip</option><option>Rainfed</option><option>Sprinkler</option></select></label>
              <label className="field-label">Previous crop<select value={newField.agronomy.Previous_Crop} onChange={(e) => setNewField({ ...newField, agronomy: { ...newField.agronomy, Previous_Crop: e.target.value } })}><option>Cotton</option><option>Wheat</option><option>Rice</option><option>Maize</option></select></label>
            </div>
          )}
          {fieldError && <p className="form-error">{fieldError}</p>}
          <button className="primary-service-button" type="submit" style={{ marginTop: 12 }}>Add field</button>
        </form>
      )}
      {editingField && (
        <form onSubmit={handleUpdateField} className="settings-card" style={{ marginBottom: 16, padding: "16px 23px", borderColor: "var(--olive)" }}>
          <h3 style={{ margin: "0 0 12px" }}>Edit: {editingField.name}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="field-label">Field name<input value={editField.name} onChange={(e) => setEditField({ ...editField, name: e.target.value })} maxLength={50} required /></label>
            <label className="field-label">Crop<select value={editField.crop} onChange={(e) => setEditField({ ...editField, crop: e.target.value })}><option>Wheat</option><option>Rice</option><option>Cotton</option><option>Maize</option><option>Soybean</option><option>Groundnut</option></select></label>
            <label className="field-label">Area<input type="number" value={editField.areaValue} onChange={(e) => setEditField({ ...editField, areaValue: e.target.value })} min="0.01" max="10000" step="0.1" required /></label>
            <label className="field-label">Unit<select value={editField.areaUnit} onChange={(e) => setEditField({ ...editField, areaUnit: e.target.value })}><option value="ac">ac</option><option value="ha">ha</option></select></label>
            <label className="field-label">Soil<select value={editField.soil} onChange={(e) => setEditField({ ...editField, soil: e.target.value })}><option>Loamy</option><option>Clay</option><option>Sandy</option><option>Silt</option><option>Alluvial</option><option>Chalky</option><option>Laterite</option><option>Peaty</option><option>Silty</option></select></label>
            <label className="field-label">Status<select value={editField.status} onChange={(e) => setEditField({ ...editField, status: e.target.value })}><option>Growing well</option><option>Needs attention</option><option>Ready for harvest</option><option>Planted</option></select></label>
            <label className="field-label">Planting date<input type="date" value={editField.plantingDate} onChange={(e) => setEditField({ ...editField, plantingDate: e.target.value })} /></label>
            <label className="field-label">Notes<input value={editField.notes} onChange={(e) => setEditField({ ...editField, notes: e.target.value })} maxLength={120} /></label>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12, background: "var(--paper)", padding: "8px 10px", borderRadius: 2 }}><input type="checkbox" checked={!!editField.useLiveWeather} onChange={(e) => setEditField({ ...editField, useLiveWeather: e.target.checked })} /> Use live weather {weather ? `(${weather?.current?.temperature}°C, ${weather?.current?.humidity}%)` : ""}</label>
          <button type="button" className="filter-button" style={{ marginTop: 8 }} onClick={() => setShowEditAgronomy((v) => !v)}>{showEditAgronomy ? "Hide soil readings" : "Show soil readings (13)"}</button>
          {showEditAgronomy && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
              {[
                ["Soil_pH", "Soil pH", "6.1"], ["Soil_Moisture", "Soil moisture (%)", "35"], ["Organic_Carbon", "OC", "0.42"],
                ["Electrical_Conductivity", "EC", "1.87"], ["Nitrogen_Level", "N", "61"], ["Phosphorus_Level", "P", "44"], ["Potassium_Level", "K", "84"],
                ["Temperature", "Temp (°C)", "19.84"], ["Humidity", "Humidity (%)", "83.31"], ["Rainfall", "Rainfall (mm)", "1693.22"],
                ["Crop_Growth_Stage", "Growth stage", "Vegetative"], ["Season", "Season", "Kharif"], ["Region", "Region", "South"],
              ].map(([key, label, ph]) => (
                <label key={key} className="field-label">{label}<input value={editField.agronomy[key] ?? ph} onChange={(e) => setEditField({ ...editField, agronomy: { ...editField.agronomy, [key]: e.target.value } })} placeholder={ph} /></label>
              ))}
              <label className="field-label">Irrigation<select value={editField.agronomy.Irrigation_Type} onChange={(e) => setEditField({ ...editField, agronomy: { ...editField.agronomy, Irrigation_Type: e.target.value } })}><option>Canal</option><option>Drip</option><option>Rainfed</option><option>Sprinkler</option></select></label>
              <label className="field-label">Previous crop<select value={editField.agronomy.Previous_Crop} onChange={(e) => setEditField({ ...editField, agronomy: { ...editField.agronomy, Previous_Crop: e.target.value } })}><option>Cotton</option><option>Wheat</option><option>Rice</option><option>Maize</option></select></label>
            </div>
          )}
          {fieldError && <p className="form-error">{fieldError}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}><button className="primary-service-button" type="submit" style={{ flex: 1 }}>Save changes</button><button type="button" className="filter-button" onClick={() => { setEditingField(null); setShowEditAgronomy(false); }}>Cancel</button></div>
        </form>
      )}
      {selectedField && !editingField && (
        <div className="settings-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ margin: 0 }}>{selectedField.name} · {selectedField.crop}</h3><button className="filter-button" onClick={() => setSelectedField(null)}>Close</button></div>
          <p style={{ color: "var(--muted)", fontSize: 12 }}>Soil: {selectedField.soil} · Area: {selectedField.areaValue} {selectedField.areaUnit} · Status: {selectedField.status} · Planted: {selectedField.plantingDate} · Created: {new Date(selectedField.createdAt).toLocaleDateString()}</p>
          {selectedField.notes && <p style={{ fontSize: 12, background: "var(--paper)", padding: 8, borderRadius: 2 }}>{selectedField.notes}</p>}
          {(() => {
            const f = fields.find((x) => x.id === selectedField.id);
            const preds = f?.predictions || {};
            const has = Object.keys(preds).length > 0;
            if (!has) return <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>No readings logged for this field yet.</p>;
            return <div style={{ display: "grid", gap: 4, marginTop: 8 }}>{Object.entries(preds).map(([svc, arr]) => <div key={svc} style={{ fontSize: 11, display: "flex", justifyContent: "space-between", background: "var(--paper)", padding: "6px 8px", borderRadius: 2 }}><span>{svc}</span><b style={{ color: "var(--olive)" }}>{String(arr[0]?.prediction).slice(0, 24)} · {new Date(arr[0]?.ts).toLocaleDateString()}</b></div>)}</div>;
          })()}
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <button className="filter-button" onClick={() => onOpenService("Crop recommendation", selectedField)}>Crop match for {selectedField.crop}</button>
            <button className="filter-button" onClick={() => onOpenService("Fertilizer recommendation", selectedField)}>Fertilizer for {selectedField.soil}</button>
            <button className="filter-button" onClick={() => onOpenService("Irrigation prediction", selectedField)}>Water need for {selectedField.name}</button>
            <button className="filter-button" onClick={() => onOpenService("Yield prediction", selectedField)}>Yield for {selectedField.name}</button>
            <button className="filter-button" style={{ background: "#f3e2da", color: "var(--clay)" }} onClick={() => handleDeleteField(selectedField)}>Delete</button>
          </div>
        </div>
      )}
      <div className="toolbar-card"><div className="search-box">⌕<input placeholder="Find a field or crop" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search fields" /></div><select className="filter-button" value={filterCrop} onChange={(e) => setFilterCrop(e.target.value)} aria-label="Filter by crop"><option>All fields</option><option>Wheat</option><option>Rice</option><option>Cotton</option><option>Maize</option><option>Soybean</option><option>Groundnut</option></select><select className="filter-button" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort fields"><option value="name">Sort: Name</option><option value="area">Sort: Area</option><option value="crop">Sort: Crop</option><option value="recent">Sort: Recent</option></select></div>
      <div className="field-grid">{filteredFields.length ? filteredFields.map((f) => <article className="field-card" key={f.id} style={{ outline: selectedField?.id === f.id ? "2px solid var(--olive)" : "none" }}><div className={`field-image ${f.tone}`}><span>{f.crop}</span><i>✳</i></div><div className="field-card-body"><div><h3>{f.name}</h3><p>{f.crop} · {f.areaValue} {f.areaUnit}{f.soil ? ` · ${f.soil}` : ""}</p></div><span className={`field-status ${f.tone}`}>{f.status}</span><div className="field-progress"><span>Planted {f.plantingDate}</span><b>{f.status === "Ready for harvest" ? "91%" : f.status === "Needs attention" ? "58%" : "74%"}</b><i><em style={{ width: f.status === "Ready for harvest" ? "91%" : f.status === "Needs attention" ? "58%" : "74%" }} /></i></div><div style={{ display: "flex", gap: 6 }}><button onClick={() => setSelectedField(f)}>View <Icon name="arrow" size={14} /></button><button className="filter-button" onClick={() => { setEditingField(f); setEditField({ ...f }); }}>Edit</button></div></div></article>) : <p style={{ color: "var(--muted)", gridColumn: "1/-1" }}>Nothing matches. Try another name or add a field.</p>}</div>
    </div>
  );

  if (page === "Recommendations") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">FIELD NOTES</span><h1>What to do next, field by field.</h1><p>Drawn from your field readings and the current season.</p></div></div>
      <div className="recommendation-list">{[
        ["Crop recommendation", "North field suits rice this season.", "94%", "mint"],
        ["Fertilizer recommendation", "River bend is low on potassium.", "91%", "violet"],
        ["Irrigation prediction", "Rain is coming. Hold irrigation for a day.", "88%", "blue"],
      ].map(([title, copy, confidence, tone]) => <article className="recommendation-row" key={title}><span className={`service-icon ${tone}`}><Icon name={serviceConfigs[title]?.icon || "sprout"} size={22} /></span><div><span className="section-kicker">NEXT ACTION</span><h3>{title}</h3><p>{copy}</p></div><strong>{confidence}<small>confidence</small></strong><button onClick={() => onOpenService(title)}>Review <Icon name="arrow" size={14} /></button></article>)}</div>
      <div className="empty-insight"><span>✳</span><div><h3>Need the full reading?</h3><p>Run one of the five checks on a specific field.</p></div><button onClick={() => onOpenService("Crop recommendation")}>Run a check <Icon name="arrow" size={14} /></button></div>
    </div>
  );

  if (page === "Insights") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">FIELD TRENDS</span><h1>Read the season in your numbers.</h1><p>What the records show so far. {fields.length} fields · live</p></div><button className="filter-button" onClick={() => showNotice("Insights updated from prediction history")}>This season⌄</button></div>
      <div className="insight-metric-grid"><article><span>Average yield</span><strong>{(() => { try { const y = JSON.parse(localStorage.getItem("acreline:history:Yield prediction") || "[]"); return y.length ? (y.reduce((s, e) => s + Number(e.prediction), 0) / y.length).toFixed(1) : "—"; } catch { return "—"; } })()} <small>t/ha</small></strong><b>{(() => { try { return JSON.parse(localStorage.getItem("acreline:history:Yield prediction") || "[]").length ? "Recorded" : "No readings"; } catch { return "No readings"; } })()}</b></article><article><span>Recorded fields</span><strong>{fields.length} <small>fields</small></strong><b>{fields.length ? "In this workspace" : "Start with a field"}</b></article><article><span>Total field area</span><strong>{fields.reduce((s, f) => s + (f.areaValue != null ? parseFloat(f.areaValue) : Array.isArray(f) ? parseFloat(f[2]) : 0) || 0, 0).toFixed(1)} <small>ac</small></strong><b>{fields.length} fields <small>· total</small></b></article></div>
      <div className="insight-panels"><article className="insight-chart-card"><div className="panel-heading"><div><span className="section-kicker">SEASON RECORD</span><h3>Yield by month</h3></div><span className="chart-pill">Live</span></div><div className="insight-bars">{[42, 55, 48, 70, 62, 78, 91].map((height, index) => <span key={index} style={{ height: `${height}%` }}><i>{["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][index]}</i></span>)}</div></article><article className="insight-tasks"><div className="panel-heading"><div><span className="section-kicker">THIS WEEK</span><h3>On the list</h3></div><button className="filter-button" onClick={() => { const t = prompt("Add task"); if (t) setTasks((p) => [...p, t]); }}>Add</button></div>{tasks.map((task) => <label key={task}><input type="checkbox" onChange={(e) => { if (e.target.checked) setTimeout(() => setTasks((p) => p.filter((x) => x !== task)), 300); }} />{task} <button onClick={() => setTasks((p) => p.filter((x) => x !== task))} style={{ marginLeft: "auto", background: "transparent", border: 0, color: "var(--clay)" }}>✕</button></label>)}</article></div>
      <div className="insight-panels" style={{ marginTop: 16 }}>
        <article className="insight-chart-card"><div className="panel-heading"><div><span className="section-kicker">FIELD BY FIELD</span><h3>Per-field overview</h3></div><span className="chart-pill">{fields.length} fields</span></div>
          <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
            {fields.slice(0, 6).map((f) => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--paper)", borderRadius: 2, fontSize: 12 }}>
                <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110 }}>{f.name}</span>
                <span style={{ color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110 }}>{f.crop} · {f.areaValue} {f.areaUnit}</span>
                <span style={{ color: "var(--olive)", fontWeight: 600, fontSize: 10, whiteSpace: "nowrap" }}>{(() => { const preds = f.predictions || {}; const yields = preds["Yield prediction"]?.[0]?.prediction; if (yields != null) return `${Number(yields).toFixed(1)} t/ha`; const first = Object.values(preds)[0]?.[0]?.prediction; return first ? String(first).slice(0, 12) : f.soil; })()}</span>
              </div>
            ))}
            {fields.length === 0 && <p style={{ color: "var(--muted)", fontSize: 12 }}>No fields yet — add one under Field records.</p>}
          </div>
        </article>
        <article className="insight-tasks"><div className="panel-heading"><div><span className="section-kicker">CROP MIX</span><h3>Area by crop</h3></div></div>
          <div style={{ marginTop: 16 }}>
            {(() => {
              const counts = fields.reduce((acc, f) => { acc[f.crop] = (acc[f.crop] || 0) + 1; return acc; }, {});
              const total = fields.length || 1;
              return Object.entries(counts).map(([crop, cnt]) => (
                <div key={crop} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, width: 70 }}>{crop}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--rule-soft)", borderRadius: 2, overflow: "hidden" }}><em style={{ display: "block", height: "100%", width: `${(cnt / total) * 100}%`, background: "var(--olive)" }} /></div>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{cnt} · {(cnt / total * 100).toFixed(0)}%</span>
                </div>
              ));
            })()}
            {fields.length === 0 && <p style={{ color: "var(--muted)", fontSize: 12 }}>No crops to show.</p>}
          </div>
        </article>
      </div>
      <div className="settings-card" style={{ marginTop: 16, padding: 16 }}>
        <div className="panel-heading"><div><span className="section-kicker">PAST READINGS</span><h3>Recent readings</h3></div><button className="filter-button" onClick={() => showNotice("History from localStorage — run a prediction to populate")}>Info</button></div>
        <div style={{ display: "grid", gap: 6, marginTop: 12 }}>
          {(() => {
            try {
              const all = ["Crop recommendation", "Fertilizer recommendation", "Irrigation prediction", "Price prediction", "Yield prediction"].flatMap((svc) => {
                const arr = JSON.parse(localStorage.getItem(`acreline:history:${svc}`) || "[]");
                return arr.slice(0, 2).map((e) => ({ svc, ...e }));
              }).sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 6);
              if (!all.length) return <p style={{ color: "var(--muted)", fontSize: 12 }}>No readings yet — run a check.</p>;
              return all.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "6px 8px", background: "var(--paper)", borderRadius: 2 }}><span>{e.svc} · {new Date(e.ts).toLocaleDateString()}</span><b style={{ color: "var(--olive)" }}>{String(e.prediction).slice(0, 24)}</b></div>);
            } catch { return <p style={{ color: "var(--muted)", fontSize: 12 }}>No readings</p>; }
          })()}
        </div>
      </div>
      <div className="settings-card" style={{ marginTop: 16, padding: 16, borderLeft: "4px solid var(--olive)" }}>
        <div className="panel-heading"><div><span className="section-kicker">DATA & MODELS</span><h3>What the models were trained on</h3></div><span className="chart-pill">5 models · 77k rows</span></div>
        <div style={{ display: "grid", gap: 8, marginTop: 12, fontSize: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "var(--paper)", borderRadius: 2, borderLeft: "3px solid var(--olive)" }}><span><b>Crop</b> · 2,201 rows · N,P,K,temp,humidity,pH,rainfall → crop</span><span style={{ color: "var(--olive)", fontWeight: 700 }}>RF 200</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "var(--paper)", borderRadius: 2, borderLeft: "3px solid #8e44ad" }}><span><b>Fertilizer</b> · 10,001 rows · 19 features → Fertilizer</span><span style={{ color: "#8e44ad", fontWeight: 700 }}>RF</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "var(--paper)", borderRadius: 2, borderLeft: "3px solid #3498db" }}><span><b>Irrigation</b> · 10,001 rows · 19 features → Need</span><span style={{ color: "#3498db", fontWeight: 700 }}>RF</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "var(--paper)", borderRadius: 2, borderLeft: "3px solid #f39c12" }}><span><b>Price</b> · 2,811 rows · 8 features → modal price</span><span style={{ color: "#f39c12", fontWeight: 700 }}>RF</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "var(--paper)", borderRadius: 2, borderLeft: "3px solid #e67e22" }}><span><b>Yield</b> · 2,001 rows · 6→10 features → t/ha</span><span style={{ color: "#e67e22", fontWeight: 700 }}>RF</span></div>
        </div>
        <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>Data in <code>data/</code> (77,015 rows) · Models <code>backend/app/models/*.pkl</code> (sklearn 1.6.1, RandomForest, SimpleImputer median/most_frequent, OneHot handle_unknown ignore) · Retrain: <code>python ml/*/train.py</code> · Current season <b>{getCurrentSeason()}</b> · Region <b>{(() => { try { return localStorage.getItem("acreline:state") ? getRegionForState(localStorage.getItem("acreline:state")) : "South"; } catch { return "South"; } })()}</b> · Weather <code>/api/weather?city=</code> (free API, cached 10min).</p>
      </div>
    </div>
  );

  if (page === "Weather station") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">WEATHER STATION</span><h1>What the sky is doing over your fields.</h1><p>Current conditions and the five-day outlook for your location.</p></div><span className="live-chip"><i /> {weatherLoading ? "Updating..." : "Live forecast"}</span></div>
      {weatherError && <p className="form-error">{weatherError}</p>}
      {weather && <><div className="weather-dashboard"><div className="current-weather"><div className="weather-sun large"><Icon name="sun" size={39} /></div><div><strong>{weather?.current?.temperature}°</strong><span>{weather?.current?.description}</span><small>{weather?.location}{weather?.country ? `, ${weather?.country}` : ""} · Updated just now</small></div></div><div className="weather-reading"><span>Humidity</span><strong>{weather?.current?.humidity}%</strong><i><em style={{ width: `${weather?.current?.humidity}%` }} /></i></div><div className="weather-reading"><span>Wind speed</span><strong>{weather?.current?.wind_speed} km/h</strong><i><em style={{ width: `${Math.min(weather?.current?.wind_speed * 3, 100)}%` }} /></i></div><div className="weather-reading"><span>Rain chance</span><strong>{weather?.current?.rain_probability}%</strong><i><em style={{ width: `${weather?.current?.rain_probability}%` }} /></i></div></div>
      <div className="forecast-card"><div className="panel-heading"><div><span className="section-kicker">FIVE-DAY OUTLOOK</span><h3>Plan around the weather</h3></div></div><div className="forecast-row">{weather?.forecast.map((day) => <div key={day.date}><span>{new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</span><Icon name={day.rain_probability > 40 ? "droplet" : "sun"} size={22} /><strong>{day.high}°</strong><small>{day.rain_probability}% rain</small></div>)}</div></div></>}
    </div>
  );

  return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">PREFERENCES</span><h1>Set Acreline up for your farm.</h1><p>Language, location and alerts. Stored on this device.</p></div></div>
      <div className="settings-card">
        <label><span><strong>Weather alerts</strong><small>Rain, frost and extreme heat warnings.</small></span><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} /><i /></label>
        <label><span><strong>Measurement units</strong><small>Acres or hectares.</small></span><select value={units} onChange={(event) => setUnits(event.target.value)}><option>Metric</option><option>Imperial</option></select></label>
        <label><span><strong>Weekly summary</strong><small>A Monday round-up of your fields and readings.</small></span><input type="checkbox" defaultChecked onChange={() => showNotice("Digest preference saved")} /><i /></label>
        <label><span><strong>{wt("settings.language")} *</strong><small>Default is English. Twelve regional languages available.</small></span>
          <select value={settingsLang} onChange={(e) => { const v = e.target.value; setSettingsLang(v); try { localStorage.setItem("acreline:language", v); wi18n.changeLanguage(v); document.documentElement.lang = v; } catch {} showNotice(`Language: ${v}`); }}>
            <option value="en">English — English</option>
            <option value="hi">Hindi — हिन्दी</option>
            <option value="ta">Tamil — தமிழ்</option>
            <option value="te">Telugu — తెలుగు</option>
            <option value="kn">Kannada — ಕನ್ನಡ</option>
            <option value="ml">Malayalam — മലയാളം</option>
            <option value="mr">Marathi — मराठी</option>
            <option value="bn">Bengali — বাংলা</option>
            <option value="or">Odia — ଓଡ଼ିଆ</option>
            <option value="gu">Gujarati — ગુજરાતી</option>
            <option value="pa">Punjabi — ਪੰਜਾਬੀ</option>
            <option value="as">Assamese — অসমীয়া</option>
            <option value="ur">Urdu — اردو</option>
          </select>
        </label>
        <label><span><strong>{wt("settings.state")} *</strong><small>Sets the default city and suggested language.</small></span>
          <select value={settingsState} onChange={(e) => { const v = e.target.value; setSettingsState(v); try { localStorage.setItem("acreline:state", v); const sugg = STATE_LANGUAGE_MAP[v]; if (sugg && !localStorage.getItem("acreline:language")) { setSettingsLang(sugg); localStorage.setItem("acreline:language", sugg); wi18n.changeLanguage(sugg); } } catch {} showNotice(`State: ${v} · capital ${getCapitalForState(v)}`); }}>
            <option value="" disabled>Select state *</option>
            {STATE_LIST.map((s) => <option key={s} value={s}>{s} {s === getCapitalForState(s) ? "" : `— ${getCapitalForState(s)}`}</option>)}
          </select>
        </label>
        <div style={{ border: "1px solid var(--rule)", borderRadius: 2, padding: 10, background: "var(--sheet)", marginTop: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink)", letterSpacing: 1.5, marginBottom: 6 }}>STATES BY REGION</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {Object.entries(REGION_COLORS).map(([region, color]) => (
              <div key={region} style={{ background: color, borderRadius: 2, padding: 6, border: settingsState && getRegionForState(settingsState) === region ? "1.5px solid var(--olive)" : "1px solid transparent" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase" }}>{region} {settingsState && getRegionForState(settingsState) === region ? "✓" : ""}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {STATE_LIST.filter((s) => getRegionForState(s) === region).map((s) => (
                    <button key={s} type="button" onClick={() => { setSettingsState(s); try { localStorage.setItem("acreline:state", s); } catch {} setSettingsCity(""); try { localStorage.removeItem("acreline:city"); } catch {} showNotice(`State: ${s} · ${getCapitalForState(s)}`); }} style={{ fontSize: 9, padding: "3px 6px", borderRadius: 2, border: settingsState === s ? "1.5px solid var(--olive)" : "1px solid var(--rule)", background: settingsState === s ? "#fff" : "rgba(255,255,255,0.85)", fontWeight: settingsState === s ? 700 : 400, whiteSpace: "nowrap" }}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--rule-soft)", paddingTop: 16, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontWeight: 700, fontSize: 12 }}>{wt("settings.city")} <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 10 }}>(optional)</span></span><small style={{ color: "var(--muted)", fontSize: 10 }}>Default: {settingsState ? getCapitalForState(settingsState) : "Hyderabad"} {settingsCity && settingsCity !== "Not mentioned" ? `· Selected: ${settingsCity}` : "· Not mentioned"}</small></div>
          {!settingsState ? <p style={{ fontSize: 11, color: "var(--muted)", background: "var(--paper)", padding: 8, borderRadius: 2 }}>Choose a state to see its cities.</p> : (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <input value={settingsCitySearch} onChange={(e) => setSettingsCitySearch(e.target.value)} placeholder="Search city..." style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 2, fontSize: 12 }} aria-label="Search city" />
                <button type="button" className="filter-button" onClick={() => setSettingsCustomCity((v) => !v)}>{settingsCustomCity ? "List" : "Custom"}</button>
              </div>
              {!settingsCustomCity ? (
                <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid var(--rule)", borderRadius: 2, background: "var(--sheet)" }}>
                  <button onClick={() => { setSettingsCity("Not mentioned"); setSettingsCitySearch(""); try { localStorage.removeItem("acreline:city"); } catch {} showNotice(`City: Not mentioned — using ${getCapitalForState(settingsState)}`); }} style={{ width: "100%", textAlign: "left", padding: "8px 10px", background: settingsCity === "Not mentioned" || !settingsCity ? "#e8e2d2" : "transparent", border: 0, borderBottom: "1px solid var(--rule)", fontSize: 12, fontWeight: settingsCity === "Not mentioned" || !settingsCity ? 700 : 400 }}>Not mentioned — use {getCapitalForState(settingsState)} (capital)</button>
                  {getCitiesForState(settingsState).filter((c) => c.toLowerCase().includes(settingsCitySearch.toLowerCase())).map((city) => (
                    <button key={city} onClick={() => { setSettingsCity(city); setSettingsCitySearch(city); try { localStorage.setItem("acreline:city", city); } catch {} showNotice(`City: ${city}`); }} style={{ width: "100%", textAlign: "left", padding: "8px 10px", background: settingsCity === city ? "#e8e2d2" : "transparent", border: 0, borderBottom: "1px solid var(--rule-soft)", fontSize: 12, fontWeight: settingsCity === city ? 600 : 400 }}>{city} {city === getCapitalForState(settingsState) && <span style={{ color: "var(--muted)", fontSize: 10 }}>· capital</span>}</button>
                  ))}
                  {getCitiesForState(settingsState).filter((c) => c.toLowerCase().includes(settingsCitySearch.toLowerCase())).length === 0 && <p style={{ padding: "8px 10px", color: "var(--muted)", fontSize: 11 }}>No match — enter a custom city.</p>}
                </div>
              ) : (
                <div>
                  <label className="field-label">Custom city<input value={settingsCity === "Not mentioned" ? "" : settingsCity} onChange={(e) => { const v = e.target.value; setSettingsCity(v); try { if (v.trim()) localStorage.setItem("acreline:city", v.trim()); else localStorage.removeItem("acreline:city"); } catch {} }} placeholder="e.g. Tirupati" style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 2, fontSize: 12 }} /></label>
                  <button type="button" className="filter-button" style={{ marginTop: 6 }} onClick={() => { setSettingsCity("Not mentioned"); try { localStorage.removeItem("acreline:city"); } catch {} showNotice("City: Not mentioned"); }}>Use Not mentioned</button>
                </div>
              )}
              <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 6, background: "var(--paper)", padding: "6px 8px", borderRadius: 2 }}>We use {settingsCity && settingsCity !== "Not mentioned" && settingsCity.trim() ? settingsCity : getCapitalForState(settingsState)} for weather. Leave empty to use the state capital.</p>
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, padding: "16px 0", borderTop: "1px solid var(--rule-soft)", marginTop: 16 }}>
          <button className="filter-button" onClick={() => { localStorage.clear(); showNotice("All local data cleared"); setTimeout(() => location.reload(), 600); }}>Clear all data</button>
          <button className="filter-button" onClick={() => { try { if (settingsLang) { localStorage.setItem("acreline:language", settingsLang); wi18n.changeLanguage(settingsLang); document.documentElement.lang = settingsLang; } if (settingsState) localStorage.setItem("acreline:state", settingsState); if (settingsCity && settingsCity !== "Not mentioned" && settingsCity.trim()) localStorage.setItem("acreline:city", settingsCity.trim()); else localStorage.removeItem("acreline:city"); } catch {} showNotice(`Saved: ${settingsState || "no state"} · ${settingsLang} · ${settingsCity || getCapitalForState(settingsState) || "Hyderabad"}`); }}>Save settings</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const [slide, setSlide] = useState(0);
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedTool, setSelectedTool] = useState("Crop recommendation");
  const [crop, setCrop] = useState("Wheat");
  const [notice, setNotice] = useState("");
  const [servicePage, setServicePage] = useState("");
  const [prefillField, setPrefillField] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingState, setOnboardingState] = useState("");
  const [onboardingLang, setOnboardingLang] = useState("en");
  const [onboardingCity, setOnboardingCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [customCityMode, setCustomCityMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefsMenuOpen, setPrefsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const lang = localStorage.getItem("acreline:language");
      const state = localStorage.getItem("acreline:state");
      if (!lang || !state) {
        setShowOnboarding(true);
        if (lang) setOnboardingLang(lang);
        if (state) {
          setOnboardingState(state);
          const suggested = STATE_LANGUAGE_MAP[state];
          if (suggested && !lang) setOnboardingLang(suggested);
        }
        const city = localStorage.getItem("acreline:city");
        if (city) setOnboardingCity(city);
      } else {
        if (lang !== i18n.language) i18n.changeLanguage(lang);
        try { document.documentElement.lang = lang; } catch {}
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (onboardingState && !localStorage.getItem("acreline:language")) {
      const suggested = STATE_LANGUAGE_MAP[onboardingState];
      if (suggested) setOnboardingLang(suggested);
    }
  }, [onboardingState]);

  useEffect(() => {
    let cancelled = false;
    const city = getEffectiveCity();
    const state = (() => { try { return localStorage.getItem("acreline:state") || ""; } catch { return ""; } })();
    const query = city ? `${city}${state ? `,${state}` : ""}` : "Hyderabad";
    const cacheKey = `acreline:weather:${query}`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && cached.ts && Date.now() - cached.ts < 10 * 60 * 1000) {
        setCurrentWeather(cached.data);
        return;
      }
    } catch {}
    fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(query)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Weather unavailable");
        return data;
      })
      .then((data) => {
        if (!cancelled) {
          setCurrentWeather(data);
          try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data })); } catch {}
        }
      })
      .catch(() => {
        if (!cancelled) setCurrentWeather(null);
      });
    return () => { cancelled = true; };
  }, [showOnboarding]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setPrefsMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const activeSlide = slides[slide];
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  }, []);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="leaf" size={22} /></div>
          <span>Acreline</span>
        </div>
        <div className="workspace-label">{t("nav.workspace")}</div>
        <nav className="main-nav">
          {[
            { key: "Overview", label: t("nav.overview") },
            { key: "My fields", label: t("nav.myfields") },
            { key: "Recommendations", label: t("nav.recommendations") },
            { key: "Insights", label: t("nav.insights") }
          ].map((item, index) => (
            <button className={`nav-item ${activeNav === item.key ? "active" : ""}`} onClick={() => { setActiveNav(item.key); setServicePage(""); }} key={item.key}>
              <Icon name={["grid", "sprout", "leaf", "chart"][index]} size={19} /><span>{item.label}</span>{item.key === "Insights" && <span className="nav-badge">3</span>}
            </button>
          ))}
        </nav>
        <div className="workspace-label tools-label">{t("nav.tools")}</div>
        <nav className="main-nav">
          <button className={`nav-item ${activeNav === "Weather station" ? "active" : ""}`} onClick={() => { setActiveNav("Weather station"); setServicePage(""); }}><Icon name="sun" size={19} /><span>{t("nav.weather")}</span>{currentWeather && <span className="nav-badge" style={{ background: "#e8e2d2" }}>{currentWeather?.current?.temperature}°</span>}</button>
          <button className={`nav-item ${activeNav === "Settings" ? "active" : ""}`} onClick={() => { setActiveNav("Settings"); setServicePage(""); }}><Icon name="settings" size={19} /><span>{t("nav.settings")}</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Icon name="sprout" size={18} /></div>
            <strong>Field guide</strong>
            <p>Soil, fertilizer and irrigation notes from your own data.</p>
            <button onClick={() => { showNotice("Guide: 7 crop signals, 19 fertilizer and 19 irrigation inputs — see /docs"); setActiveNav("Insights"); setServicePage(""); }}>View guides <Icon name="arrow" size={14} /></button>
          </div>
          <button className="profile" onClick={() => { setActiveNav("Settings"); setServicePage(""); }}>
            <div className="avatar">F</div><div><strong>Farm workspace</strong><small>Local field records</small></div><span className="profile-more">›</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileMenuOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 2, border: "1px solid var(--rule)", background: "var(--sheet)" }}><Icon name="menu" /></button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setPrefsMenuOpen((v) => !v)} style={{ padding: "6px 10px", borderRadius: 2, border: "1px solid var(--rule)", background: "var(--paper)", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }} aria-label="Preferences"><Icon name="settings" size={14} /> {t("nav.settings")} ▾</button>
              {prefsMenuOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 9 }} onClick={() => setPrefsMenuOpen(false)} aria-hidden="true" />
                  <div style={{ position: "absolute", left: 0, top: 36, background: "var(--sheet)", border: "1px solid var(--rule)", borderRadius: 2, padding: 12, width: 300, maxWidth: "90vw", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Quick settings</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", background: "var(--paper)", padding: "6px 8px", borderRadius: 2, marginBottom: 8 }}>
                      State: <b>{(() => { try { return localStorage.getItem("acreline:state") || "Not set"; } catch { return "Not set"; } })()}</b> · City: <b>{(() => { try { return localStorage.getItem("acreline:city") || getCapitalForState(localStorage.getItem("acreline:state") || "") || "Hyderabad"; } catch { return "Hyderabad"; } })()}</b> · Lang: <b>{i18n.language}</b>
                    </div>
                    <button className="filter-button" onClick={() => { setPrefsMenuOpen(false); setShowOnboarding(true); }} style={{ width: "100%", justifyContent: "center" }}>Change location or language</button>
                    <button className="filter-button" onClick={() => { setPrefsMenuOpen(false); setActiveNav("Settings"); setServicePage(""); }} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>Open settings</button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{servicePage || activeNav}</strong></div>
          <div className="top-actions">
            <select value={i18n.language} onChange={(e) => { const v = e.target.value; try { localStorage.setItem("acreline:language", v); } catch {} i18n.changeLanguage(v); try { document.documentElement.lang = v; } catch {} showNotice(`Language: ${v}`); }} className="topbar-lang" style={{ padding: "6px 8px", borderRadius: 2, border: "1px solid var(--rule)", fontSize: 11, background: "var(--paper)" }} aria-label="Language">
              <option value="en">English</option><option value="hi">हिन्दी — Hindi</option><option value="ta">தமிழ் — Tamil</option><option value="te">తెలుగు — Telugu</option><option value="kn">ಕನ್ನಡ — Kannada</option><option value="ml">മലയാളം — Malayalam</option><option value="mr">मराठी — Marathi</option><option value="bn">বাংলা — Bengali</option><option value="or">ଓଡ଼ିଆ — Odia</option><option value="gu">ગુજરાતી — Gujarati</option><option value="pa">ਪੰਜਾਬੀ — Punjabi</option><option value="as">অসমীয়া — Assamese</option><option value="ur">اردو — Urdu</option>
            </select>
            <span className="sync-status"><i /> {currentWeather ? `Live · ${currentWeather?.location}` : "Syncing..."} · {getCurrentSeason()} · {currentWeather ? `${currentWeather?.current?.temperature}°` : "—"}</span><button className="icon-button" onClick={() => { showNotice(currentWeather ? `${currentWeather?.current?.description} · ${currentWeather?.current?.humidity}% humidity` : "No weather yet"); setActiveNav("Weather station"); setServicePage(""); }} aria-label="Notifications"><Icon name="bell" size={19} /><em>2</em></button><button className="new-button" onClick={() => { setActiveNav("My fields"); setServicePage(""); showNotice("Add a field to track area & soil"); }}><Icon name="plus" size={16} /> New field</button></div>
        </header>
        {mobileMenuOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40, display: "flex" }} onClick={() => setMobileMenuOpen(false)}>
            <div style={{ width: 280, maxWidth: "85vw", background: "var(--sheet)", padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontFamily: "Fraunces, Georgia, serif" }}><div className="brand-mark"><Icon name="leaf" size={18} /></div> Acreline <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted)" }}>Tap outside to close</span></div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 1.5 }}>WORKSPACE</div>
              {[
                { key: "Overview", label: t("nav.overview"), icon: "grid" },
                { key: "My fields", label: t("nav.myfields"), icon: "sprout" },
                { key: "Recommendations", label: t("nav.recommendations"), icon: "leaf" },
                { key: "Insights", label: t("nav.insights"), icon: "chart" },
                { key: "Weather station", label: t("nav.weather"), icon: "sun" },
                { key: "Settings", label: t("nav.settings"), icon: "settings" }
              ].map((item) => (
                <button key={item.key} onClick={() => { setActiveNav(item.key); setServicePage(""); setMobileMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 2, border: activeNav === item.key ? "1px solid var(--olive)" : "1px solid transparent", background: activeNav === item.key ? "#e8e2d2" : "var(--paper)", textAlign: "left", fontSize: 13, fontWeight: activeNav === item.key ? 600 : 400 }}><Icon name={item.icon} size={16} /> {item.label}</button>
              ))}
              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 12, marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Quick settings</div>
                <label style={{ fontSize: 11, display: "grid", gap: 4, marginBottom: 8 }}>Language
                  <select value={i18n.language} onChange={(e) => { const v = e.target.value; try { localStorage.setItem("acreline:language", v); } catch {} i18n.changeLanguage(v); try { document.documentElement.lang = v; } catch {} showNotice(`Language: ${v}`); }} style={{ padding: "6px 8px", borderRadius: 2, border: "1px solid var(--rule)", fontSize: 11 }}>
                    <option value="en">English — English</option><option value="hi">Hindi — हिन्दी</option><option value="ta">Tamil — தமிழ்</option><option value="te">Telugu — తెలుగు</option><option value="kn">Kannada — ಕನ್ನಡ</option><option value="ml">Malayalam — മലയാളം</option><option value="mr">Marathi — मराठी</option><option value="bn">Bengali — বাংলা</option><option value="or">Odia — ଓଡ଼ିଆ</option><option value="gu">Gujarati — ગુજરાતી</option><option value="pa">Punjabi — ਪੰਜਾਬੀ</option><option value="as">Assamese — অসমীয়া</option><option value="ur">Urdu — اردو</option>
                  </select>
                </label>
                <button className="filter-button" onClick={() => { setMobileMenuOpen(false); setShowOnboarding(true); }} style={{ width: "100%", justifyContent: "center" }}>Change location or language</button>
                <button className="filter-button" onClick={() => { setMobileMenuOpen(false); setActiveNav("Settings"); setServicePage(""); }} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>Open settings</button>
              </div>
              <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--rule)", fontSize: 11, color: "var(--muted)" }}>
                <div>Language: <b>{i18n.language}</b></div>
                <div>State: <b>{(() => { try { return localStorage.getItem("acreline:state") || "Not set"; } catch { return "Not set"; } })()}</b></div>
                <div>City: <b>{(() => { try { return localStorage.getItem("acreline:city") || getCapitalForState(localStorage.getItem("acreline:state") || "") || "Hyderabad"; } catch { return "Hyderabad"; } })()}</b></div>
              </div>
            </div>
          </div>
        )}

        <div className="page-content">
          {servicePage ? <ServicePage serviceName={servicePage} prefillField={prefillField} weather={currentWeather} onBack={() => { setServicePage(""); setPrefillField(null); setActiveNav("Overview"); }} showNotice={showNotice} /> : activeNav !== "Overview" ? <WorkspacePage page={activeNav} onOpenService={(name, field) => { setServicePage(name); setPrefillField(field || null); setActiveNav("Overview"); }} showNotice={showNotice} /> : <>
          <section className="welcome-row">
            <div><p className="overline">{greeting} <span className="wave">✳</span></p><h1>Your farm, this morning.</h1><p className="subheading">Readings from your fields and the weather station.</p></div>
            <div className="weather-pill"><div className="weather-sun"><Icon name={currentWeather?.current?.rain_probability > 40 ? "droplet" : "sun"} size={24} /></div><div><strong>{currentWeather ? `${currentWeather?.current?.temperature}°` : "—"} <span>{currentWeather?.current?.description || "Weather unavailable"}</span></strong><small>{currentWeather ? `${currentWeather?.location} · Today` : "Weather feed offline"}</small></div></div>
          </section>

          <section className={`hero-banner ${activeSlide.className}`} key={slide}>
            <div className="hero-copy"><span className="hero-eyebrow">{activeSlide.eyebrow}</span><h2>{activeSlide.title}</h2><p>{activeSlide.copy}</p><button className="hero-button" onClick={() => { setActiveNav("Insights"); }} >See the numbers <Icon name="arrow" size={16} /></button></div>
            <div className="hero-visual"><div className="season-plate"><span className="plate-label">Field notes · {getCurrentSeason()}</span><div className="plate-row"><span>Sowing window</span><b>{getCurrentSeason() === "Rabi" ? "Oct — Dec" : getCurrentSeason() === "Zaid" ? "Mar — Apr" : "Jun — Jul"}</b></div><div className="plate-row"><span>Harvest window</span><b>{getCurrentSeason() === "Rabi" ? "Mar — Apr" : getCurrentSeason() === "Zaid" ? "Jun — Jul" : "Oct — Nov"}</b></div><div className="plate-row"><span>Station</span><b>{currentWeather?.location || "Hyderabad"}</b></div></div><span className="hero-accent">{activeSlide.accent}</span></div>
            <div className="hero-dots">{slides.map((item, index) => <button aria-label={`Show slide ${index + 1}`} className={slide === index ? "selected" : ""} onClick={() => setSlide(index)} key={item.eyebrow} />)}</div>
          </section>

          <section className="services-section">
            <div className="section-heading services-heading"><div><span className="section-kicker">THE FIVE CHECKS</span><h2>One check for each field decision.</h2></div><p>Trained on soil, weather and crop records.</p></div>
            <div className="services-grid">{services.map((service) => <button className="service-card" key={service.title} onClick={() => { setServicePage(service.title); setPrefillField(null); }}><span className={`service-icon ${service.color}`}><Icon name={service.icon} size={25} /></span><span className="service-card-copy"><strong>{service.title}</strong><small>{service.copy}</small><em>Run check <Icon name="arrow" size={14} /></em></span></button>)}</div>
          </section>

          <section className="section-heading"><div><span className="section-kicker">FIELD SNAPSHOT</span><h2>The numbers behind the season.</h2></div><button className="text-button" onClick={() => setActiveNav("Insights")}>All trends <Icon name="arrow" size={15} /></button></section>
          <section className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span className="stat-icon green"><Icon name="sprout" size={20} /></span><span className="trend up">fields</span></div><strong>{(() => { try { const raw = localStorage.getItem("acreline:fields"); const f = raw ? JSON.parse(raw) : []; const total = f.reduce((s, e) => s + (e.areaValue != null ? parseFloat(e.areaValue) : Array.isArray(e) ? parseFloat(e[2]) : 0) || 0, 0); return total.toFixed(1); } catch { return "0.0"; } })()} <small>ac</small></strong><p>Area under cultivation</p><div className="mini-bars green-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon blue"><Icon name="droplet" size={20} /></span><span className="trend up">{currentWeather ? "weather" : "offline"}</span></div><strong>{currentWeather ? `${currentWeather?.current?.humidity}` : "—"}<span className="percent">{currentWeather ? "%" : ""}</span></strong><p>{currentWeather ? `Humidity · ${currentWeather?.current?.description}` : "Weather not available"}</p><div className="progress-track"><i style={{ width: `${currentWeather?.current?.humidity || 0}%` }} /></div><small className="goal-label">{currentWeather?.location || "Add an API key to enable weather"}</small></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon gold"><Icon name="chart" size={20} /></span><span className="trend up">yield</span></div><strong>{(() => { try { const y = JSON.parse(localStorage.getItem("acreline:history:Yield prediction") || "[]"); return y.length ? (y.reduce((s, e) => s + Number(e.prediction), 0) / y.length).toFixed(1) : "—"; } catch { return "—"; } })()} <small>{(() => { try { return JSON.parse(localStorage.getItem("acreline:history:Yield prediction") || "[]").length ? "t/ha" : ""; } catch { return ""; } })()}</small></strong><p>Average recorded yield</p><div className="mini-bars gold-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
          </section>

          <section className="lower-grid">
            <article className="panel activity-panel"><div className="panel-heading"><div><span className="section-kicker">FIELD ACTIVITY</span><h3>Growing conditions</h3></div><button className="period-select">Last 7 days <span>⌄</span></button></div><div className="chart-area"><div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart"><div className="grid-line" /><div className="grid-line" /><div className="grid-line" /><div className="grid-line" /><svg viewBox="0 0 600 180" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#b88935" stopOpacity=".35" /><stop offset="1" stopColor="#b88935" stopOpacity="0" /></linearGradient></defs><path className="chart-fill" d="M0,129 C35,130 45,112 81,119 S128,90 158,104 S200,120 235,79 S278,100 315,81 S350,54 382,67 S420,92 452,58 S495,76 527,45 S568,54 600,27 V180 H0Z" /><path className="chart-line" d="M0,129 C35,130 45,112 81,119 S128,90 158,104 S200,120 235,79 S278,100 315,81 S350,54 382,67 S420,92 452,58 S495,76 527,45 S568,54 600,27" /></svg><div className="chart-x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div><div className="legend"><span><i className="legend-dot soil" /> Soil health</span><span><i className="legend-dot moisture" /> Moisture level</span><strong>+18.4% <small>this week</small></strong></div></article>
            <article className="panel tools-panel"><div className="panel-heading"><div><span className="section-kicker">QUICK CHECKS</span><h3>Pick a check to run.</h3></div></div><div className="tool-list">{tools.map((tool) => <button className={`tool-row ${selectedTool === tool.label ? "chosen" : ""}`} key={tool.label} onClick={() => { setSelectedTool(tool.label); setServicePage(tool.service); setPrefillField(null); }}><span className={`tool-icon ${tool.color}`}><Icon name={tool.icon} size={19} /></span><span><strong>{tool.label}</strong><small>{tool.detail} — run {tool.service}</small></span><Icon name="arrow" size={16} /></button>)}</div><button className="full-action" onClick={() => { document.querySelector(".services-section")?.scrollIntoView({ behavior: "smooth" }); showNotice("Five checks available above."); }}>See all checks <Icon name="arrow" size={15} /></button></article>
          </section>

          <section style={{ marginTop: 24, background: "var(--sheet)", border: "1px solid var(--rule)", borderRadius: 2, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}><div><span className="section-kicker">EVERYDAY NOTES</span><h3 style={{ margin: "4px 0 0", fontFamily: "Fraunces, Georgia, serif", fontSize: 16 }}>Small things worth checking each morning.</h3></div><span style={{ fontSize: 11, color: "var(--muted)", background: "var(--paper)", padding: "6px 8px", borderRadius: 2 }}>{currentWeather ? `${currentWeather?.location} · ${currentWeather?.current?.temperature}°C` : "Live data"}</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <div style={{ background: "var(--paper)", borderRadius: 2, padding: 14, border: "1px solid var(--rule-soft)" }}><div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 1 }}><Icon name="sun" size={12} /> TODAY'S NOTE</div><p style={{ fontSize: 13, fontWeight: 600, margin: "8px 0 4px", lineHeight: 1.4 }}>{currentWeather && currentWeather?.current?.rain_probability > 40 ? "Rain expected. Hold irrigation, check drainage, skip spraying." : currentWeather && currentWeather?.current?.temperature > 32 ? "Hot and dry. Irrigate at dawn and mulch to hold moisture." : "Good sowing weather. Check pH and apply NPK as advised."}</p><small style={{ color: "var(--muted)", fontSize: 11 }}>Based on live {currentWeather ? `${currentWeather?.location} ${currentWeather?.current?.humidity}% humidity` : "weather"} · <button onClick={() => setActiveNav("Weather station")} style={{ background: "transparent", border: 0, color: "var(--olive)", fontSize: 11, fontWeight: 600, padding: 0 }}>View weather →</button></small></div>
              <div style={{ background: "var(--sheet)", border: "1px solid var(--rule)", borderRadius: 2, padding: 14 }}><div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 1 }}><Icon name="chart" size={12} /> MANDI PRICES</div><div style={{ display: "grid", gap: 6, marginTop: 8, fontSize: 12 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span>Wheat</span><b>₹2,340 <small style={{ color: "#6a8a55" }}>↑2%</small></b></div><div style={{ display: "flex", justifyContent: "space-between" }}><span>Rice</span><b>₹2,890 <small style={{ color: "var(--clay)" }}>↓1%</small></b></div><div style={{ display: "flex", justifyContent: "space-between" }}><span>Cotton</span><b>₹6,200 <small style={{ color: "#6a8a55" }}>↑4%</small></b></div></div><button onClick={() => setServicePage("Price prediction")} style={{ marginTop: 8, fontSize: 11, color: "var(--olive)", background: "transparent", border: 0, fontWeight: 600, padding: 0 }}>Forecast →</button><small style={{ display: "block", color: "var(--muted)", fontSize: 10, marginTop: 4 }}>From crop_price_dataset · `/api/price/predict`</small></div>
              <div style={{ background: "var(--paper)", borderRadius: 2, padding: 14, border: "1px solid var(--rule-soft)" }}><div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 1 }}><Icon name="leaf" size={12} /> SOWING CALENDAR</div><p style={{ fontSize: 13, fontWeight: 600, margin: "8px 0 4px" }}>{new Date().toLocaleDateString(undefined, { month: "long" })} — {new Date().getMonth() >= 5 && new Date().getMonth() <= 9 ? "Kharif: Rice, Maize, Cotton, Soybean" : new Date().getMonth() >= 10 || new Date().getMonth() <= 2 ? "Rabi: Wheat, Mustard, Chickpea" : "Zaid: Watermelon, Vegetables"}</p><small style={{ color: "var(--muted)", fontSize: 11 }}>Check the yield estimate for your planting date</small><button onClick={() => setActiveNav("Insights")} style={{ marginTop: 8, fontSize: 11, color: "var(--olive)", background: "transparent", border: 0, fontWeight: 600, padding: 0 }}>View calendar →</button></div>
              <div style={{ background: "var(--sheet)", border: "1px solid var(--rule)", borderRadius: 2, padding: 14 }}><div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 1 }}><Icon name="sprout" size={12} /> SOIL READING</div><p style={{ fontSize: 12, margin: "8px 0 4px", lineHeight: 1.5 }}>{(() => { try { const raw = localStorage.getItem("acreline:fields"); const f = raw ? JSON.parse(raw) : []; if (!f.length) return "Add a field to log pH, N, P and K."; const avgPh = (f.reduce((s, x) => s + (parseFloat(x.agronomy?.Soil_pH ?? x.soil === "Loamy" ? 6.5 : 6.1) || 6.5), 0) / f.length).toFixed(1); const avgN = Math.round(f.reduce((s, x) => s + (parseFloat(x.agronomy?.Nitrogen_Level) || 61), 0) / f.length); return `Avg pH ${avgPh} · N ${avgN} · ${f.length} fields · tap to check fertilizer.`; } catch { return "Log pH, N, P and K for a better reading."; } })()}</p><button onClick={() => setActiveNav("My fields")} style={{ marginTop: 8, fontSize: 11, color: "var(--olive)", background: "transparent", border: 0, fontWeight: 600, padding: 0 }}>Manage fields →</button></div>
            </div>
          </section>

          <section className="recommendation-card"><div className="rec-copy"><span className="section-kicker">A CHECK FOR YOUR FIELD</span><h2>Ready for the next check?</h2><p>Tell us the crop. We'll match it to your field readings.</p></div><div className="rec-form"><label>I’m growing <select value={crop} onChange={(event) => setCrop(event.target.value)}><option>Wheat</option><option>Rice</option><option>Cotton</option><option>Maize</option><option>Soybean</option></select></label><button onClick={() => { setServicePage("Crop recommendation"); setPrefillField(null); showNotice(`Opening crop recommendation for ${crop}`); }}>Get the match <Icon name="arrow" size={16} /></button></div></section>
          </>}
        </div>
      </main>
      {showOnboarding && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(25,59,47,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} role="dialog" aria-modal="true" aria-label={t("onboarding.title")}>
          <div style={{ background: "var(--sheet)", borderRadius: 2, padding: 24, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Fraunces, Georgia, serif", fontSize: 22 }}>{t("onboarding.title")}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>{t("onboarding.subtitle")}</p>
            <div style={{ display: "grid", gap: 14 }}>
              <label className="field-label">{t("onboarding.state")}
                <select value={onboardingState} onChange={(e) => { setOnboardingState(e.target.value); setOnboardingCity(""); setCitySearch(""); setCustomCityMode(false); }} required style={{ border: !onboardingState ? "1.5px solid var(--clay)" : undefined }}>
                  <option value="" disabled>Select state *</option>
                  {STATE_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <div style={{ border: "1px solid var(--rule)", borderRadius: 2, padding: 10, background: "var(--sheet)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink)", letterSpacing: 1.5, marginBottom: 6 }}>STATES BY REGION — TAP ONE</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {Object.entries(REGION_COLORS).map(([region, color]) => (
                    <div key={region} style={{ background: color, borderRadius: 2, padding: 6, border: onboardingState && getRegionForState(onboardingState) === region ? "1.5px solid var(--olive)" : "1px solid transparent" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase" }}>{region} {onboardingState && getRegionForState(onboardingState) === region ? "✓" : ""}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                        {STATE_LIST.filter((s) => getRegionForState(s) === region).map((s) => (
                          <button key={s} onClick={() => { setOnboardingState(s); setOnboardingCity(""); setCitySearch(""); setCustomCityMode(false); }} style={{ fontSize: 9, padding: "3px 6px", borderRadius: 2, border: onboardingState === s ? "1.5px solid var(--olive)" : "1px solid var(--rule)", background: onboardingState === s ? "#fff" : "rgba(255,255,255,0.85)", fontWeight: onboardingState === s ? 700 : 400, whiteSpace: "nowrap" }}>{s}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>North <span style={{ background: REGION_COLORS.North, padding: "1px 4px", borderRadius: 2 }}>green</span> · South <span style={{ background: REGION_COLORS.South, padding: "1px 4px", borderRadius: 2 }}>blue</span> · East <span style={{ background: REGION_COLORS.East, padding: "1px 4px", borderRadius: 2 }}>orange</span> · West <span style={{ background: REGION_COLORS.West, padding: "1px 4px", borderRadius: 2 }}>pink</span> · Central <span style={{ background: REGION_COLORS.Central, padding: "1px 4px", borderRadius: 2 }}>purple</span> — selected city highlighted below.</p>
              </div>
              <label className="field-label">{t("onboarding.language")}
                <select value={onboardingLang} onChange={(e) => setOnboardingLang(e.target.value)} required>
                  <option value="en">{t("language.en")} — English</option>
                  <option value="hi">{t("language.hi")} — Hindi</option>
                  <option value="ta">{t("language.ta")} — Tamil</option>
                  <option value="te">{t("language.te")} — Telugu</option>
                  <option value="kn">{t("language.kn")} — Kannada</option>
                  <option value="ml">{t("language.ml")} — Malayalam</option>
                  <option value="mr">{t("language.mr")} — Marathi</option>
                  <option value="bn">{t("language.bn")} — Bengali</option>
                  <option value="or">{t("language.or")} — Odia</option>
                  <option value="gu">{t("language.gu")} — Gujarati</option>
                  <option value="pa">{t("language.pa")} — Punjabi</option>
                  <option value="as">{t("language.as")} — Assamese</option>
                  <option value="ur">{t("language.ur")} — Urdu</option>
                </select>
              </label>
              {onboardingState ? (
                <div>
                  <label className="field-label">{t("onboarding.city")} <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 10 }}>(optional)</span>
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      <input value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder={t("onboarding.cityPlaceholder")} style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 2, fontSize: 13 }} aria-label="Search city" />
                      <button type="button" className="filter-button" onClick={() => setCustomCityMode((v) => !v)}>{customCityMode ? "List" : "Custom"}</button>
                    </div>
                  </label>
                  {!customCityMode ? (
                    <div style={{ maxHeight: 140, overflowY: "auto", border: "1px solid var(--rule)", borderRadius: 2, marginTop: 8, background: "var(--sheet)" }}>
                      <button onClick={() => { setOnboardingCity("Not mentioned"); setCitySearch(""); }} style={{ width: "100%", textAlign: "left", padding: "8px 10px", background: onboardingCity === "Not mentioned" ? "#e8e2d2" : "transparent", border: 0, borderBottom: "1px solid var(--rule)", fontSize: 12, fontWeight: onboardingCity === "Not mentioned" ? 700 : 400 }}>{t("onboarding.notMentioned")} — {getCapitalForState(onboardingState)} (capital)</button>
                      {getCitiesForState(onboardingState).filter((c) => c.toLowerCase().includes(citySearch.toLowerCase())).map((city) => (
                        <button key={city} onClick={() => { setOnboardingCity(city); setCitySearch(city); }} style={{ width: "100%", textAlign: "left", padding: "8px 10px", background: onboardingCity === city ? "#e8e2d2" : "transparent", border: 0, borderBottom: "1px solid var(--rule-soft)", fontSize: 12, fontWeight: onboardingCity === city ? 600 : 400 }}>{city} {city === getCapitalForState(onboardingState) && <span style={{ color: "var(--muted)", fontSize: 10 }}>· capital</span>}</button>
                      ))}
                      {getCitiesForState(onboardingState).filter((c) => c.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && <p style={{ padding: "8px 10px", color: "var(--muted)", fontSize: 11 }}>No match — enter a custom city.</p>}
                    </div>
                  ) : (
                    <div style={{ marginTop: 8 }}>
                      <label className="field-label">{t("onboarding.customCity")}<input value={onboardingCity === "Not mentioned" ? "" : onboardingCity} onChange={(e) => setOnboardingCity(e.target.value)} placeholder="e.g. Tirupati" style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 2, fontSize: 13 }} /></label>
                      <button type="button" className="filter-button" style={{ marginTop: 6 }} onClick={() => setOnboardingCity("Not mentioned")}>{t("onboarding.notMentioned")}</button>
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, background: "var(--paper)", padding: "6px 8px", borderRadius: 2 }}>{t("onboarding.cityHint", { city: getCapitalForState(onboardingState), state: onboardingState })} {onboardingCity && onboardingCity !== "Not mentioned" ? `· Selected: ${onboardingCity}` : ""}</p>
                </div>
              ) : (
                <p style={{ fontSize: 11, color: "var(--muted)", background: "var(--paper)", padding: "8px", borderRadius: 2 }}>Choose a state to see its cities. City is optional — the capital is used by default.</p>
              )}
              {!onboardingState || !onboardingLang ? <p style={{ color: "var(--clay)", fontSize: 11 }}>{t("onboarding.required")}</p> : null}
              <button
                onClick={() => {
                  if (!onboardingState || !onboardingLang) { showNotice(t("onboarding.required")); return; }
                  try {
                    localStorage.setItem("acreline:state", onboardingState);
                    localStorage.setItem("acreline:language", onboardingLang);
                    if (onboardingCity && onboardingCity !== "Not mentioned" && onboardingCity.trim()) localStorage.setItem("acreline:city", onboardingCity.trim());
                    else localStorage.removeItem("acreline:city");
                    i18n.changeLanguage(onboardingLang);
                    try { document.documentElement.lang = onboardingLang; } catch {}
                    setShowOnboarding(false);
                    showNotice(`Saved: ${onboardingState} · ${t("language." + onboardingLang)}${onboardingCity && onboardingCity !== "Not mentioned" ? ` · ${onboardingCity}` : ` · ${getCapitalForState(onboardingState)}`}`);
                  } catch (e) { showNotice("Save failed"); }
                }}
                className="primary-service-button"
                disabled={!onboardingState || !onboardingLang}
                style={{ opacity: !onboardingState || !onboardingLang ? 0.5 : 1 }}
              >
                {t("onboarding.save")} <Icon name="arrow" size={16} />
              </button>
              <p style={{ fontSize: 10, color: "var(--muted)", textAlign: "center" }}>State and language required · City optional · Hyderabad fallback</p>
            </div>
          </div>
        </div>
      )}
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
    </div>
  );
}

export default App;