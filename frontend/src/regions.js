export const STATE_DATA = {
  "Andhra Pradesh": { capital: "Amaravati", region: "South", cities: ["Amaravati", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada", "Rajahmundry", "Nellore", "Kurnool", "Anantapur"] },
  "Arunachal Pradesh": { capital: "Itanagar", region: "NorthEast", cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang"] },
  "Assam": { capital: "Dispur", region: "NorthEast", cities: ["Dispur", "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"] },
  "Bihar": { capital: "Patna", region: "East", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"] },
  "Chhattisgarh": { capital: "Raipur", region: "Central", cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"] },
  "Goa": { capital: "Panaji", region: "West", cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"] },
  "Gujarat": { capital: "Gandhinagar", region: "West", cities: ["Gandhinagar", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"] },
  "Haryana": { capital: "Chandigarh", region: "North", cities: ["Chandigarh", "Faridabad", "Gurugram", "Panipat", "Ambala", "Hisar"] },
  "Himachal Pradesh": { capital: "Shimla", region: "North", cities: ["Shimla", "Dharamshala", "Solan", "Mandi", "Manali"] },
  "Jharkhand": { capital: "Ranchi", region: "East", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"] },
  "Karnataka": { capital: "Bengaluru", region: "South", cities: ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Kalaburagi", "Davangere", "Shivamogga"] },
  "Kerala": { capital: "Thiruvananthapuram", region: "South", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kottayam"] },
  "Madhya Pradesh": { capital: "Bhopal", region: "Central", cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar"] },
  "Maharashtra": { capital: "Mumbai", region: "West", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Thane"] },
  "Manipur": { capital: "Imphal", region: "NorthEast", cities: ["Imphal", "Thoubal", "Bishnupur"] },
  "Meghalaya": { capital: "Shillong", region: "NorthEast", cities: ["Shillong", "Tura", "Cherrapunji"] },
  "Mizoram": { capital: "Aizawl", region: "NorthEast", cities: ["Aizawl", "Lunglei", "Saiha"] },
  "Nagaland": { capital: "Kohima", region: "NorthEast", cities: ["Kohima", "Dimapur", "Mokokchung"] },
  "Odisha": { capital: "Bhubaneswar", region: "East", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"] },
  "Punjab": { capital: "Chandigarh", region: "North", cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"] },
  "Rajasthan": { capital: "Jaipur", region: "North", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar"] },
  "Sikkim": { capital: "Gangtok", region: "NorthEast", cities: ["Gangtok", "Namchi", "Gyalshing"] },
  "Tamil Nadu": { capital: "Chennai", region: "South", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Thanjavur"] },
  "Telangana": { capital: "Hyderabad", region: "South", cities: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar"] },
  "Tripura": { capital: "Agartala", region: "NorthEast", cities: ["Agartala", "Dharmanagar", "Udaipur"] },
  "Uttar Pradesh": { capital: "Lucknow", region: "North", cities: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Noida", "Bareilly"] },
  "Uttarakhand": { capital: "Dehradun", region: "North", cities: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh"] },
  "West Bengal": { capital: "Kolkata", region: "East", cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Kharagpur"] },
  "Andaman and Nicobar Islands": { capital: "Port Blair", region: "South", cities: ["Port Blair"] },
  "Chandigarh": { capital: "Chandigarh", region: "North", cities: ["Chandigarh"] },
  "Dadra and Nagar Haveli and Daman and Diu": { capital: "Daman", region: "West", cities: ["Daman", "Diu", "Silvassa"] },
  "Delhi": { capital: "Delhi", region: "North", cities: ["Delhi", "New Delhi"] },
  "Jammu and Kashmir": { capital: "Srinagar", region: "North", cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla"] },
  "Ladakh": { capital: "Leh", region: "North", cities: ["Leh", "Kargil"] },
  "Lakshadweep": { capital: "Kavaratti", region: "South", cities: ["Kavaratti"] },
  "Puducherry": { capital: "Puducherry", region: "South", cities: ["Puducherry", "Karaikal", "Yanam", "Mahe"] },
  "default": { capital: "Hyderabad", region: "South", cities: ["Hyderabad"] }
};

export const STATE_LIST = Object.keys(STATE_DATA).filter(k => k !== "default");

export const REGION_COLORS = {
  North: "#dfe6d6",
  South: "#d9e3e2",
  East: "#eae0c8",
  West: "#e9d9cd",
  Central: "#e2dce5"
};

export const REGION_LABELS = {
  North: "North",
  South: "South",
  East: "East",
  West: "West",
  Central: "Central"
};

export const getCitiesForState = (state) => {
  const entry = STATE_DATA[state] || STATE_DATA["default"];
  return [entry.capital, ...entry.cities.filter(c => c !== entry.capital)];
};

export const getCapitalForState = (state) => (STATE_DATA[state] || STATE_DATA["default"]).capital;

export const getRegionForState = (state) => (STATE_DATA[state] || STATE_DATA["default"]).region;

export const STATE_LANGUAGE_MAP = {
  "Andhra Pradesh": "te",
  "Telangana": "te",
  "Karnataka": "kn",
  "Tamil Nadu": "ta",
  "Kerala": "ml",
  "Maharashtra": "mr",
  "Gujarat": "gu",
  "West Bengal": "bn",
  "Odisha": "or",
  "Punjab": "pa",
  "Haryana": "hi",
  "Delhi": "hi",
  "Uttar Pradesh": "hi",
  "Bihar": "hi",
  "Madhya Pradesh": "hi",
  "Rajasthan": "hi",
  "Himachal Pradesh": "hi",
  "Uttarakhand": "hi",
  "Jammu and Kashmir": "ur",
  "Ladakh": "ur",
  "Chhattisgarh": "hi",
  "Jharkhand": "hi",
  "Goa": "en",
  "Assam": "as",
  "Arunachal Pradesh": "en",
  "Manipur": "en",
  "Meghalaya": "en",
  "Mizoram": "en",
  "Nagaland": "en",
  "Sikkim": "en",
  "Tripura": "bn",
  "Andaman and Nicobar Islands": "en",
  "Chandigarh": "hi",
  "Dadra and Nagar Haveli and Daman and Diu": "gu",
  "Lakshadweep": "ml",
  "Puducherry": "ta"
};

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "ur", label: "Urdu", native: "اردو" }
];
