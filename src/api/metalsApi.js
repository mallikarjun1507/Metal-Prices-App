// Toggle this to use real API:
const USE_MOCK = true;

// Example "different routes" per metal
const ROUTES = {
  gold:      "/api/metal/gold",
  silver:    "/api/metal/silver",
  platinum:  "/api/metal/platinum",
  palladium: "/api/metal/palladium",
};

// ---- MOCK IMPLEMENTATION ----
const mockBase = "https://mock.simplefamily.local";
const mockStore = {
  gold:     { name: "Gold",     pricePerGram24k: 6160, prevClose: 6120, prevOpen: 6135 },
  silver:   { name: "Silver",   pricePerGram24k: 76,   prevClose: 75,   prevOpen: 75.5 },
  platinum: { name: "Platinum", pricePerGram24k: 3190, prevClose: 3170, prevOpen: 3178 },
  palladium:{ name: "Palladium",pricePerGram24k: 6890, prevClose: 6855, prevOpen: 6862 },
};
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function mockFetch(metal) {
  await delay(800 + Math.random() * 600);
  const item = mockStore[metal];
  if (!item) throw new Error("Metal not found");
  return {
    ...item,
    route: `${mockBase}${ROUTES[metal]}`,
    timestamp: Date.now(),
  };
}

// ---- REAL API (goldapi.io) SWITCH ----
// Make sure to: npm i --save whatwg-fetch (optional on web; RN has fetch)
const GOLDAPI_KEY = "PUT_YOUR_GOLDAPI_KEY_HERE"; // <--- replace when USE_MOCK=false
const goldApiBase = "https://www.goldapi.io/api";
const symbols = {
  gold: "XAU",
  silver: "XAG",
  platinum: "XPT",
  palladium: "XPD",
};

async function fetchFromGoldApi(metal) {
  const sym = symbols[metal];
  if (!sym) throw new Error("Unknown metal");
  const url = `${goldApiBase}/${sym}/INR`; // price in INR
  const res = await fetch(url, {
    headers: {
      "x-access-token": GOLDAPI_KEY,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API ${res.status}: ${t}`);
  }
  const j = await res.json();
  // goldapi.io response typically has: price, open_price, prev_close_price, timestamp (unix)
  const ts = (j.timestamp ? j.timestamp * 1000 : Date.now());
  return {
    name: j.metal || metal[0].toUpperCase() + metal.slice(1),
    pricePerGram24k: Math.round((j.price_per_gram_24k ?? j.price_per_gram) * 100) / 100,
    prevOpen: Math.round((j.open_price_per_gram_24k ?? j.open_price) * 100) / 100,
    prevClose: Math.round((j.prev_close_price_per_gram_24k ?? j.prev_close_price) * 100) / 100,
    route: url,
    timestamp: ts,
  };
}

// Public functions — one per route (explicit)
export async function fetchGold()      { return USE_MOCK ? mockFetch("gold")      : fetchFromGoldApi("gold"); }
export async function fetchSilver()    { return USE_MOCK ? mockFetch("silver")    : fetchFromGoldApi("silver"); }
export async function fetchPlatinum()  { return USE_MOCK ? mockFetch("platinum")  : fetchFromGoldApi("platinum"); }
export async function fetchPalladium() { return USE_MOCK ? mockFetch("palladium") : fetchFromGoldApi("palladium"); }
