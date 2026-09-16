// ============================================================
// RENTORA AI - BACKEND SERVER
// VoiceRent / Rentora AI Rental Assistant
// ============================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Groq = require("groq-sdk");

const app = express();
const PORT = 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
});

// ============================================================
// GROQ
// ============================================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ============================================================
// VEHICLE INVENTORY
// ============================================================

const vehicles = [
  // CHIRALA
  {
    id: 1,
    name: "Honda Activa 6G",
    category: "scooter",
    city: "Chirala",
    pricePerDay: 500,
    available: true,
  },
  {
    id: 2,
    name: "Royal Enfield Classic 350",
    category: "bike",
    city: "Chirala",
    pricePerDay: 900,
    available: true,
  },
  {
    id: 3,
    name: "Hyundai i20",
    category: "car",
    city: "Chirala",
    pricePerDay: 1500,
    available: true,
  },
  {
    id: 4,
    name: "Maruti Swift",
    category: "car",
    city: "Chirala",
    pricePerDay: 1300,
    available: true,
  },
  {
    id: 5,
    name: "Yamaha MT-15",
    category: "bike",
    city: "Chirala",
    pricePerDay: 850,
    available: true,
  },

  // ONGOLE
  {
    id: 6,
    name: "TVS Jupiter",
    category: "scooter",
    city: "Ongole",
    pricePerDay: 450,
    available: true,
  },
  {
    id: 7,
    name: "Honda Shine",
    category: "bike",
    city: "Ongole",
    pricePerDay: 550,
    available: true,
  },
  {
    id: 8,
    name: "Maruti Baleno",
    category: "car",
    city: "Ongole",
    pricePerDay: 1400,
    available: true,
  },
  {
    id: 9,
    name: "Tata Punch",
    category: "car",
    city: "Ongole",
    pricePerDay: 1600,
    available: true,
  },
  {
    id: 10,
    name: "Hero Sprint MTB",
    category: "cycle",
    city: "Ongole",
    pricePerDay: 250,
    available: true,
  },

  // VIJAYAWADA
  {
    id: 11,
    name: "Honda Activa 6G",
    category: "scooter",
    city: "Vijayawada",
    pricePerDay: 550,
    available: true,
  },
  {
    id: 12,
    name: "TVS Apache RTR 160",
    category: "bike",
    city: "Vijayawada",
    pricePerDay: 750,
    available: true,
  },
  {
    id: 13,
    name: "Hyundai Creta",
    category: "car",
    city: "Vijayawada",
    pricePerDay: 2200,
    available: true,
  },
  {
    id: 14,
    name: "Maruti Swift",
    category: "car",
    city: "Vijayawada",
    pricePerDay: 1400,
    available: true,
  },
  {
    id: 15,
    name: "Firefox Road Runner",
    category: "cycle",
    city: "Vijayawada",
    pricePerDay: 300,
    available: true,
  },

  // GUNTUR
  {
    id: 16,
    name: "Suzuki Access 125",
    category: "scooter",
    city: "Guntur",
    pricePerDay: 500,
    available: true,
  },
  {
    id: 17,
    name: "Honda Hornet 2.0",
    category: "bike",
    city: "Guntur",
    pricePerDay: 800,
    available: true,
  },
  {
    id: 18,
    name: "Hyundai i20",
    category: "car",
    city: "Guntur",
    pricePerDay: 1500,
    available: true,
  },
  {
    id: 19,
    name: "Tata Nexon",
    category: "car",
    city: "Guntur",
    pricePerDay: 1900,
    available: true,
  },
  {
    id: 20,
    name: "Hercules MTB",
    category: "cycle",
    city: "Guntur",
    pricePerDay: 250,
    available: true,
  },

  // NELLORE
  {
    id: 21,
    name: "Honda Dio",
    category: "scooter",
    city: "Nellore",
    pricePerDay: 450,
    available: true,
  },
  {
    id: 22,
    name: "Bajaj Pulsar 150",
    category: "bike",
    city: "Nellore",
    pricePerDay: 650,
    available: true,
  },
  {
    id: 23,
    name: "Maruti Brezza",
    category: "car",
    city: "Nellore",
    pricePerDay: 1800,
    available: true,
  },
  {
    id: 24,
    name: "Maruti WagonR",
    category: "car",
    city: "Nellore",
    pricePerDay: 1200,
    available: true,
  },

  // VISAKHAPATNAM
  {
    id: 25,
    name: "TVS Ntorq 125",
    category: "scooter",
    city: "Visakhapatnam",
    pricePerDay: 600,
    available: true,
  },
  {
    id: 26,
    name: "Royal Enfield Hunter 350",
    category: "bike",
    city: "Visakhapatnam",
    pricePerDay: 1000,
    available: true,
  },
  {
    id: 27,
    name: "Hyundai Creta",
    category: "car",
    city: "Visakhapatnam",
    pricePerDay: 2300,
    available: true,
  },
  {
    id: 28,
    name: "Kia Sonet",
    category: "car",
    city: "Visakhapatnam",
    pricePerDay: 2000,
    available: true,
  },

  // TIRUPATI
  {
    id: 29,
    name: "Honda Activa 6G",
    category: "scooter",
    city: "Tirupati",
    pricePerDay: 550,
    available: true,
  },
  {
    id: 30,
    name: "Yamaha FZ",
    category: "bike",
    city: "Tirupati",
    pricePerDay: 700,
    available: true,
  },
  {
    id: 31,
    name: "Maruti Ertiga",
    category: "car",
    city: "Tirupati",
    pricePerDay: 2100,
    available: true,
  },
  {
    id: 32,
    name: "Maruti Swift",
    category: "car",
    city: "Tirupati",
    pricePerDay: 1400,
    available: true,
  },
];

// ============================================================
// PICKUP LOCATIONS
// ============================================================

const pickupLocations = {
  Chirala: {
    address: "Rentora pickup location in Chirala",
    instructions:
      "The exact pickup address will be provided with your booking confirmation.",
  },

  Ongole: {
    address: "Rentora pickup location in Ongole",
    instructions:
      "The exact pickup address will be provided with your booking confirmation.",
  },

  Vijayawada: {
    address: "Rentora pickup location in Vijayawada",
    instructions:
      "The exact pickup address will be provided with your booking confirmation.",
  },

  Guntur: {
    address: "Rentora pickup location in Guntur",
    instructions:
      "The exact pickup address will be provided with your booking confirmation.",
  },

  Nellore: {
    address: "Rentora pickup location in Nellore",
    instructions:
      "The exact pickup address will be provided with your booking confirmation.",
  },

  Visakhapatnam: {
    address: "Rentora pickup location in Visakhapatnam",
    instructions:
      "The exact pickup address will be provided with your booking confirmation.",
  },

  Tirupati: {
    address: "Rentora pickup location in Tirupati",
    instructions:
      "The exact pickup address will be provided with your booking confirmation.",
  },
};

// ============================================================
// BOOKINGS
// ============================================================

const bookings = [];

// ============================================================
// CUSTOMER STORAGE
// ============================================================

const dataDirectory = path.join(__dirname, "data");
const customersFile = path.join(dataDirectory, "customers.json");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

if (!fs.existsSync(customersFile)) {
  fs.writeFileSync(customersFile, "[]");
}

function loadCustomers() {
  try {
    const data = fs.readFileSync(customersFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
}

function saveCustomers(customers) {
  fs.writeFileSync(
    customersFile,
    JSON.stringify(customers, null, 2)
  );
}

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

// ============================================================
// KNOWLEDGE BASE
// ============================================================

const knowledgeDirectory = path.join(__dirname, "knowledge");
let knowledgeBase = [];

function loadKnowledgeBase() {
  knowledgeBase = [];

  if (!fs.existsSync(knowledgeDirectory)) {
    console.log(
      "Knowledge directory not found. Skipping knowledge base."
    );
    return;
  }

  const files = fs
    .readdirSync(knowledgeDirectory)
    .filter((file) => file.endsWith(".txt"));

  for (const file of files) {
    try {
      const filePath = path.join(
        knowledgeDirectory,
        file
      );

      const content = fs.readFileSync(
        filePath,
        "utf8"
      );

      knowledgeBase.push({
        file,
        content,
      });
    } catch (error) {
      console.error(
        `Could not load ${file}:`,
        error.message
      );
    }
  }

  console.log(
    `Knowledge base loaded: ${knowledgeBase.length} document(s)`
  );
}

loadKnowledgeBase();

// ============================================================
// BASIC HELPERS
// ============================================================

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findCity(text = "") {
  const normalizedText = normalize(text);

  const cities = [
    "Chirala",
    "Ongole",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Visakhapatnam",
    "Tirupati",
  ];

  return (
    cities.find((city) =>
      normalizedText.includes(city.toLowerCase())
    ) || null
  );
}

function detectVehicleCategory(text = "") {
  const normalizedText = normalize(text);

  if (
    /\b(bike|bikes|motorbike|motorbikes|motorcycle|motorcycles)\b/.test(
      normalizedText
    )
  ) {
    return "bike";
  }

  if (
    /\b(scooter|scooters|activa|jupiter|dio|access|ntorq)\b/.test(
      normalizedText
    )
  ) {
    return "scooter";
  }

  if (
    /\b(car|cars|vehicle|vehicles|suv|hatchback)\b/.test(
      normalizedText
    )
  ) {
    return "car";
  }

  if (
    /\b(cycle|cycles|bicycle|bicycles|mtb)\b/.test(
      normalizedText
    )
  ) {
    return "cycle";
  }

  return null;
}

function extractDuration(text, waitingFor = null)  {
  if (!text) return null;

  const lower = text.toLowerCase().trim();

  // If Rentora is specifically waiting for duration,
  // a bare number like "2" means 2 days.
  if (waitingFor === "duration") {
    const bareNumber = lower.match(/^(\d+)$/);

    if (bareNumber) {
      const days = Number(bareNumber[1]);

      if (days >= 1 && days <= 365) {
        return days;
      }
    }
  }

  // Examples:
  // "2 days"
  // "2 day"
  // "for 2 days"
  // "2 weeks"
  // "for 2 weeks"
  // "1 month"
  const match = lower.match(
    /(?:for\s+)?(\d+)\s*(day|days|week|weeks|month|months)\b/
  );

  if (!match) return null;

  const number = Number(match[1]);
  const unit = match[2];

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  if (unit.startsWith("week")) {
    return number * 7;
  }

  if (unit.startsWith("month")) {
    return number * 30;
  }

  return number;
}

function detectRentalDate(text = "") {
  const normalizedText = normalize(text);

  if (
    normalizedText.includes("tomorrow") ||
    normalizedText.includes("tmrw")
  ) {
    return "tomorrow";
  }

  if (normalizedText.includes("today")) {
    return "today";
  }

  const dateMatch = String(text).match(
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/
  );

  if (dateMatch) {
    return dateMatch[1];
  }

  return null;
}

function findVehicleByName(text = "", city = null) {
  const normalizedText = normalize(text);

  let cityVehicles = vehicles;

  if (city) {
    cityVehicles = vehicles.filter(
      (vehicle) =>
        vehicle.city.toLowerCase() ===
        city.toLowerCase()
    );
  }

  const sortedVehicles = [...cityVehicles].sort(
    (a, b) => b.name.length - a.name.length
  );

  return (
    sortedVehicles.find((vehicle) =>
      normalizedText.includes(
        normalize(vehicle.name)
      )
    ) || null
  );
}

function findRequestedVehicle(text = "", city = null) {
  const normalizedText = normalize(text);

  const exactVehicle = findVehicleByName(
    text,
    city
  );

  if (exactVehicle) {
    return {
      type: "exact",
      vehicle: exactVehicle,
    };
  }

  if (
    normalizedText.includes("royal enfield") ||
    normalizedText.includes("bullet")
  ) {
    return {
      type: "brand",
      brand: "Royal Enfield",
    };
  }

  return null;
}

function getAvailableVehicles(
  city = null,
  category = null
) {
  return vehicles.filter((vehicle) => {
    const cityMatches =
      !city ||
      vehicle.city.toLowerCase() ===
        city.toLowerCase();

    const categoryMatches =
      !category ||
      vehicle.category === category;

    return (
      cityMatches &&
      categoryMatches &&
      vehicle.available
    );
  });
}

function formatVehicleList(vehicleList) {
  if (!vehicleList.length) {
    return "";
  }

  return vehicleList
    .map(
      (vehicle) =>
        `${vehicle.name} - ₹${vehicle.pricePerDay}/day`
    )
    .join("\n");
}

function getCustomerName(customerName = "") {
  if (!customerName) {
    return "";
  }

  return String(customerName).trim();
}

// ============================================================
// INTENT DETECTION
// ============================================================

function isGreeting(text = "") {
  const normalizedText = normalize(text);

  return /^(hi|hello|hey|hey there|good morning|good afternoon|good evening)$/.test(
    normalizedText
  );
}

function isDocumentQuestion(text = "") {
  const normalizedText = normalize(text);

  return (
    normalizedText.includes("document") ||
    normalizedText.includes("documents") ||
    normalizedText.includes("proof") ||
    normalizedText.includes("license") ||
    normalizedText.includes("licence") ||
    normalizedText.includes("id proof") ||
    normalizedText.includes("identity proof")
  );
}

function isCancellationQuestion(text = "") {
  const normalizedText = normalize(text);

  return (
    normalizedText.includes("cancel") ||
    normalizedText.includes("cancellation")
  );
}

function isPickupLocationQuestion(text = "") {
  const normalizedText = normalize(text);

  const pickupWords =
    normalizedText.includes("pickup") ||
    normalizedText.includes("pick up") ||
    normalizedText.includes("collect") ||
    normalizedText.includes("collection") ||
    normalizedText.includes("where should i come") ||
    normalizedText.includes("where do i come") ||
    normalizedText.includes("where can i collect") ||
    normalizedText.includes("where can i pick");

  const locationWords =
    normalizedText.includes("where") ||
    normalizedText.includes("location") ||
    normalizedText.includes("address") ||
    normalizedText.includes("place") ||
    normalizedText.includes("come");

  return pickupWords && locationWords;
}

function isAvailabilityQuestion(text = "") {
  const normalizedText = normalize(text);

  return (
    normalizedText.includes("available") ||
    normalizedText.includes("availability") ||
    normalizedText.includes("do you have") ||
    normalizedText.includes("what do you have") ||
    normalizedText.includes("which vehicles")
  );
}

function isPriceQuestion(text = "") {
  const normalizedText = normalize(text);

  return (
    normalizedText.includes("price") ||
    normalizedText.includes("cost") ||
    normalizedText.includes("rate") ||
    normalizedText.includes("how much") ||
    normalizedText.includes("rent")
  );
}

function isConfirmation(text = "") {
  const normalizedText = normalize(text);

  return (
    normalizedText === "yes" ||
    normalizedText === "yeah" ||
    normalizedText === "yep" ||
    normalizedText === "sure" ||
    normalizedText === "okay" ||
    normalizedText === "ok" ||
    normalizedText === "confirm" ||
    normalizedText === "confirmed" ||
    normalizedText === "book it" ||
    normalizedText === "do it"
  );
}

function isNegative(text = "") {
  const normalizedText = normalize(text);

  return (
    normalizedText === "no" ||
    normalizedText === "nope" ||
    normalizedText === "not now" ||
    normalizedText === "cancel"
  );
}

// ============================================================
// CONVERSATION STATE
// ============================================================

const conversationStates = new Map();

function createEmptyConversationState() {
  return {
    city: null,
    category: null,
    selectedVehicle: null,
    durationDays: null,
    rentalDate: null,

    // Possible values:
    // null
    // "city"
    // "category"
    // "vehicle"
    // "vehicle_confirmation"
    // "duration"
    // "rental_date"
    // "confirmation"
    // "pickup_city"
    waitingFor: null,
    vehicleOptions: [],

    pendingBooking: null,
  };
}

function getConversation(sessionId) {
  if (!conversationStates.has(sessionId)) {
    conversationStates.set(
      sessionId,
      createEmptyConversationState()
    );
  }

  return conversationStates.get(sessionId);
}

function resetConversation(sessionId) {
  conversationStates.set(
    sessionId,
    createEmptyConversationState()
  );
}

// ============================================================
// PICKUP LOCATION
// ============================================================

function getPickupLocation(city) {
  if (!city) {
    return null;
  }

  return pickupLocations[city] || null;
}

function formatPickupLocation(city) {
  const location = getPickupLocation(city);

  if (!location) {
    return `I don't have a pickup location configured for ${city} yet.`;
  }

  return (
    `You can collect your rental in ${city}.\n\n` +
    `Pickup location: ${location.address}\n` +
    `${location.instructions}`
  );
}

// ============================================================
// BOOKING CREATION
// ============================================================

function createBooking(
  state,
  customerName = ""
) {
  if (!state.pendingBooking) {
    return null;
  }

  const pending = state.pendingBooking;

  const booking = {
    id: `VR-${Date.now()}`,
    customerName:
      customerName || "Guest",

    vehicleId:
      pending.vehicle.id,

    vehicleName:
      pending.vehicle.name,

    category:
      pending.vehicle.category,

    city:
      pending.city,

    rentalDate:
      pending.rentalDate,

    durationDays:
      pending.durationDays,

    pricePerDay:
      pending.vehicle.pricePerDay,

    totalAmount:
      pending.total,

    pickupLocation:
      getPickupLocation(pending.city),

    status: "confirmed",

    createdAt:
      new Date().toISOString(),
  };

  bookings.push(booking);

  return booking;
}

// ============================================================
// RENTAL CONVERSATION ENGINE
// ============================================================

function handleRentalConversation(
  message,
  sessionId,
  customerName = ""
) {
  const state = getConversation(sessionId);

  const text = String(message || "").trim();

  if (!text) {
    return {
      handled: true,
      reply:
        "Please tell me what kind of rental you need.",
      state,
    };
  }

  const cityFromMessage =
    findCity(text);

  const categoryFromMessage =
    detectVehicleCategory(text);

  const durationFromMessage =
    extractDuration(text, state.waitingFor);

  const dateFromMessage =
    detectRentalDate(text);
  // Handle a vehicle choice by name when Rentora is waiting
  // for the user to choose from previously displayed vehicles.
  if (state.waitingFor === "vehicle" && state.vehicleOptions?.length) {
    const selectedOption = state.vehicleOptions.find((vehicle) => {
      const vehicleName = normalize(vehicle.name);
      const userText = normalize(text);

      return (
        userText === vehicleName ||
        vehicleName.includes(userText) ||
        userText.includes(vehicleName)
      );
    });

    if (selectedOption) {
      state.selectedVehicle = selectedOption;
      state.vehicleOptions = [];
      state.waitingFor = null;

      if (!state.rentalDate) {
        state.waitingFor = "rental_date";

        return {
          handled: true,
          reply: `${selectedOption.name} is ₹${selectedOption.pricePerDay}/day. What date would you like to rent it?`,
          state,
        };
      }

      if (!state.durationDays) {
        state.waitingFor = "duration";

        return {
          handled: true,
          reply: `${selectedOption.name} is ₹${selectedOption.pricePerDay}/day. How many days would you like to rent it?`,
          state,
        };
      }
    }
  }
    // ======================================================
  // VEHICLE SELECTION FROM PREVIOUSLY DISPLAYED OPTIONS
  // ======================================================

  if (
    state.waitingFor === "vehicle" &&
    Array.isArray(state.vehicleOptions) &&
    state.vehicleOptions.length > 0
  ) {
    const normalizedText = normalize(text);

    // Support:
    // "Maruti"
    // "Maruti Swift"
    // "2"
    // "second"
    // "second one"
    const numberMatch = normalizedText.match(/^(\d+)$/);

    let selectedVehicle = null;

    // Number selection
    if (numberMatch) {
      const index = Number(numberMatch[1]) - 1;

      if (
        index >= 0 &&
        index < state.vehicleOptions.length
      ) {
        selectedVehicle = state.vehicleOptions[index];
      }
    }

    // Name / partial-name selection
    if (!selectedVehicle) {
      selectedVehicle = state.vehicleOptions.find((vehicle) => {
        const vehicleName = normalize(vehicle.name);

        return (
          normalizedText === vehicleName ||
          vehicleName.includes(normalizedText) ||
          normalizedText.includes(vehicleName)
        );
      });
    }

    // Handle words like "first", "second", etc.
    if (!selectedVehicle) {
      const ordinalMap = {
        first: 0,
        "1st": 0,
        second: 1,
        "2nd": 1,
        third: 2,
        "3rd": 2,
        fourth: 3,
        "4th": 3,
        fifth: 4,
        "5th": 4,
      };

      for (const [word, index] of Object.entries(ordinalMap)) {
        if (normalizedText.includes(word)) {
          if (index < state.vehicleOptions.length) {
            selectedVehicle = state.vehicleOptions[index];
          }
          break;
        }
      }
    }

    if (selectedVehicle) {
      state.selectedVehicle = selectedVehicle;
      state.vehicleOptions = [];
      state.waitingFor = null;

      // If date is already known, keep it.
      if (dateFromMessage) {
        state.rentalDate = dateFromMessage;
      }

      // If duration is already known, keep it.
      if (durationFromMessage) {
        state.durationDays = durationFromMessage;
      }

      // Ask for missing rental date first.
      if (!state.rentalDate) {
        state.waitingFor = "rental_date";

        return {
          handled: true,
          reply:
            `${selectedVehicle.name} is available in ${state.city} for ₹${selectedVehicle.pricePerDay}/day. ` +
            `What date would you like to rent it?`,
          state,
        };
      }

      // Ask for missing duration.
      if (!state.durationDays) {
        state.waitingFor = "duration";

        return {
          handled: true,
          reply:
            `Great choice! ${selectedVehicle.name} is ₹${selectedVehicle.pricePerDay}/day. ` +
            `How many days would you like to rent it?`,
          state,
        };
      }

      // We have everything needed for confirmation.
      const total =
        selectedVehicle.pricePerDay * state.durationDays;

      state.pendingBooking = {
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        vehicleType: selectedVehicle.type,
        city: state.city,
        rentalDate: state.rentalDate,
        durationDays: state.durationDays,
        pricePerDay: selectedVehicle.pricePerDay,
        totalAmount: total,
      };

      state.waitingFor = "confirmation";

      return {
        handled: true,
        reply:
          `Perfect.\n\n` +
          `Vehicle: ${selectedVehicle.name}\n` +
          `City: ${state.city}\n` +
          `Rental date: ${state.rentalDate}\n` +
          `Duration: ${state.durationDays} day(s)\n` +
          `Price: ₹${selectedVehicle.pricePerDay}/day\n` +
          `Total: ₹${total}\n\n` +
          `Would you like me to confirm the booking?`,
        state,
      };
    }
  }
  // ==========================================================
  // GREETING
  // ==========================================================

  if (isGreeting(text)) {
    const name =
      getCustomerName(customerName);

    return {
      handled: true,
      reply: name
        ? `Hello ${name}! I'm Rentora AI. How can I help you with your rental today?`
        : "Hello! I'm Rentora AI. How can I help you with your rental today?",
      state,
    };
  }
    // ======================================================
  // WAITING FOR RENTAL DATE
  // ======================================================

  if (state.waitingFor === "rental_date") {
    if (dateFromMessage) {
      state.rentalDate = dateFromMessage;
      state.waitingFor = null;

      // We already have the vehicle, so now ask for duration.
      if (state.selectedVehicle && !state.durationDays) {
        state.waitingFor = "duration";

        return {
          handled: true,
          reply:
            `Perfect. ${state.selectedVehicle.name} is ₹${state.selectedVehicle.pricePerDay}/day. ` +
            `How many days would you like to rent it?`,
          state,
        };
      }

      // If duration was somehow already supplied,
      // move directly to booking confirmation.
      if (
        state.selectedVehicle &&
        state.durationDays &&
        state.city &&
        state.rentalDate
      ) {
        const total =
          state.selectedVehicle.pricePerDay *
          state.durationDays;

        state.pendingBooking = {
          vehicleId: state.selectedVehicle.id,
          vehicleName: state.selectedVehicle.name,
          vehicleType: state.selectedVehicle.type,
          city: state.city,
          rentalDate: state.rentalDate,
          durationDays: state.durationDays,
          pricePerDay: state.selectedVehicle.pricePerDay,
          totalAmount: total,
        };

        state.waitingFor = "confirmation";

        return {
          handled: true,
          reply:
            `Perfect.\n\n` +
            `Vehicle: ${state.selectedVehicle.name}\n` +
            `City: ${state.city}\n` +
            `Rental date: ${state.rentalDate}\n` +
            `Duration: ${state.durationDays} day(s)\n` +
            `Price: ₹${state.selectedVehicle.pricePerDay}/day\n` +
            `Total: ₹${total}\n\n` +
            `Would you like me to confirm the booking?`,
          state,
        };
      }
    }

    return {
      handled: true,
      reply:
        "Please tell me the rental date, for example tomorrow or 25 September.",
      state,
    };
  }

  // ==========================================================
  // PICKUP LOCATION
  //
  // MUST happen before vehicle/category detection.
  // ==========================================================

  if (isPickupLocationQuestion(text)) {
    if (!state.city) {
      state.waitingFor = "pickup_city";

      return {
        handled: true,
        reply:
          "Sure. Which city would you like to collect the vehicle from?",
        state,
      };
    }

    state.waitingFor = null;

    return {
      handled: true,
      reply:
        formatPickupLocation(state.city),
      state,
    };
  }

  // ==========================================================
  // DOCUMENT QUESTIONS
  // ==========================================================

  if (isDocumentQuestion(text)) {
    return {
      handled: true,
      reply:
        "For a rental, you'll generally need a valid government ID and a valid driving licence for motor vehicles. The exact documents can be confirmed during booking.",
      state,
    };
  }

  // ==========================================================
  // CANCELLATION
  // ==========================================================

  if (isCancellationQuestion(text)) {
    state.waitingFor = null;
    state.pendingBooking = null;
    state.selectedVehicle = null;

    return {
      handled: true,
      reply:
        "Sure. If you already have a booking, please provide your booking ID and I can help you with the cancellation process.",
      state,
    };
  }

  // ==========================================================
  // NEGATIVE RESPONSE
  // ==========================================================

  if (isNegative(text)) {
    state.waitingFor = null;
    state.pendingBooking = null;
    state.selectedVehicle = null;

    return {
      handled: true,
      reply:
        "No problem. What would you like to rent instead?",
      state,
    };
  }

  // ==========================================================
  // IMPORTANT:
  // HANDLE "YES" AFTER VEHICLE OFFER
  //
  // Example:
  // Rentora:
  // "We have Honda Shine available... Would you like this one?"
  //
  // Customer:
  // "yes"
  //
  // Result:
  // Ask duration.
  // ==========================================================

  if (
    isConfirmation(text) &&
    state.waitingFor === "vehicle_confirmation" &&
    state.selectedVehicle
  ) {
    const vehicle =
      state.selectedVehicle;

    state.waitingFor = "duration";

    return {
      handled: true,
      reply:
        `Great choice! ${vehicle.name} is ₹${vehicle.pricePerDay}/day. How many days would you like to rent it?`,
      state,
    };
  }

  // ==========================================================
  // FINAL BOOKING CONFIRMATION
  //
  // Example:
  // Rentora:
  // "Total: ₹1,100. Would you like me to confirm?"
  //
  // Customer:
  // "yes"
  //
  // Result:
  // Create booking.
  // ==========================================================

  if (
    isConfirmation(text) &&
    state.waitingFor === "confirmation" &&
    state.pendingBooking
  ) {
    const booking =
      createBooking(
        state,
        customerName
      );

    if (!booking) {
      return {
        handled: true,
        reply:
          "I couldn't complete the booking. Please try again.",
        state,
      };
    }

    const pickup =
      getPickupLocation(
        booking.city
      );

    state.waitingFor = null;
    state.pendingBooking = null;

    const reply =
      `Booking confirmed!\n\n` +
      `Booking ID: ${booking.id}\n` +
      `Vehicle: ${booking.vehicleName}\n` +
      `City: ${booking.city}\n` +
      `Rental date: ${booking.rentalDate}\n` +
      `Duration: ${booking.durationDays} day(s)\n` +
      `Total: ₹${booking.totalAmount}\n\n` +
      `Pickup location: ${
        pickup
          ? pickup.address
          : "To be provided"
      }\n` +
      `${
        pickup
          ? pickup.instructions
          : ""
      }`;

    return {
      handled: true,
      reply,
      booking,
      state,
    };
  }

  // ==========================================================
  // SAVE CITY
  // ==========================================================

  if (cityFromMessage) {
    state.city = cityFromMessage;
  }

  // ==========================================================
  // SAVE CATEGORY
  // ==========================================================

  if (categoryFromMessage) {
    state.category =
      categoryFromMessage;
  }

  // ==========================================================
  // SAVE DATE
  // ==========================================================

  if (dateFromMessage) {
    state.rentalDate =
      dateFromMessage;
  }

  // ==========================================================
  // SAVE DURATION
  // ==========================================================

  if (durationFromMessage) {
    state.durationDays =
      durationFromMessage;
  }

  // ==========================================================
  // EXACT VEHICLE REQUEST
  // ==========================================================

  const requestedVehicle =
    findRequestedVehicle(
      text,
      state.city
    );

  if (
    requestedVehicle &&
    requestedVehicle.type === "exact"
  ) {
    const vehicle =
      requestedVehicle.vehicle;

    if (
      state.city &&
      vehicle.city.toLowerCase() !==
        state.city.toLowerCase()
    ) {
      return {
        handled: true,
        reply:
          `${vehicle.name} is available in ${vehicle.city}, not ${state.city}. Would you like to rent it from ${vehicle.city}?`,
        state,
      };
    }

    state.city =
      vehicle.city;

    state.category =
      vehicle.category;

    state.selectedVehicle =
      vehicle;

    // If duration was included in the same message
    if (durationFromMessage) {
      const total =
        vehicle.pricePerDay *
        durationFromMessage;

      state.pendingBooking = {
        vehicle,
        city: vehicle.city,
        durationDays:
          durationFromMessage,
        rentalDate:
          state.rentalDate,
        total,
      };

      state.waitingFor =
        "confirmation";

      return {
        handled: true,
        reply:
          `Great. ${vehicle.name} is ₹${vehicle.pricePerDay}/day.\n\n` +
          `Rental duration: ${durationFromMessage} day(s)\n` +
          `${
            state.rentalDate
              ? `Rental date: ${state.rentalDate}\n`
              : ""
          }` +
          `Total: ₹${total}\n\n` +
          `Would you like me to confirm the booking?`,
        state,
      };
    }

    // Need date first
    if (!state.rentalDate) {
      state.waitingFor =
        "rental_date";

      return {
        handled: true,
        reply:
          `${vehicle.name} is available in ${vehicle.city} for ₹${vehicle.pricePerDay}/day. What date would you like to rent it?`,
        state,
      };
    }

    // Need duration
    if (!state.durationDays) {
      state.waitingFor =
        "duration";

      return {
        handled: true,
        reply:
          `${vehicle.name} is available in ${vehicle.city} for ₹${vehicle.pricePerDay}/day. How many days would you like to rent it?`,
        state,
      };
    }
  }

  // ==========================================================
  // ROYAL ENFIELD / BRAND REQUEST
  // ==========================================================

  if (
    requestedVehicle &&
    requestedVehicle.type === "brand"
  ) {
    const brandVehicles =
      vehicles.filter(
        (vehicle) => {
          const matchesBrand =
            vehicle.name
              .toLowerCase()
              .includes("royal enfield");

          const matchesCity =
            !state.city ||
            vehicle.city.toLowerCase() ===
              state.city.toLowerCase();

          return (
            matchesBrand &&
            matchesCity &&
            vehicle.available
          );
        }
      );

    if (!brandVehicles.length) {
      return {
        handled: true,
        reply: state.city
          ? `I couldn't find a Royal Enfield available in ${state.city}. I won't substitute it with another bike unless you ask me to.`
          : "I couldn't find a Royal Enfield available for your current request. I won't substitute it with another bike unless you ask me to.",
        state,
      };
    }

    if (!state.city) {
      state.waitingFor =
        "city";

      return {
        handled: true,
        reply:
          "Sure. Which city would you like the Royal Enfield in?",
        state,
      };
    }

    if (brandVehicles.length === 1) {
      state.selectedVehicle =
        brandVehicles[0];

      state.category =
        "bike";

      state.city =
        brandVehicles[0].city;

      state.waitingFor =
        "vehicle_confirmation";

      return {
        handled: true,
        reply:
          `${brandVehicles[0].name} is available in ${brandVehicles[0].city} for ₹${brandVehicles[0].pricePerDay}/day. Would you like this one?`,
        state,
      };
    }

    return {
      handled: true,
      reply:
        `I found these Royal Enfield options in ${state.city}:\n\n` +
        formatVehicleList(
          brandVehicles
        ) +
        `\n\nWhich one would you like?`,
      state,
    };
  }

  // ==========================================================
  // SELECTED VEHICLE + DURATION
  // ==========================================================

  if (
    state.selectedVehicle &&
    durationFromMessage
  ) {
    const vehicle =
      state.selectedVehicle;

    state.durationDays =
      durationFromMessage;

    const total =
      vehicle.pricePerDay *
      durationFromMessage;

    state.pendingBooking = {
      vehicle,
      city: state.city,
      durationDays:
        durationFromMessage,
      rentalDate:
        state.rentalDate,
      total,
    };

    state.waitingFor =
      "confirmation";

    return {
      handled: true,
      reply:
        `Perfect.\n\n` +
        `Vehicle: ${vehicle.name}\n` +
        `City: ${vehicle.city}\n` +
        `${
          state.rentalDate
            ? `Rental date: ${state.rentalDate}\n`
            : ""
        }` +
        `Duration: ${durationFromMessage} day(s)\n` +
        `Price: ₹${vehicle.pricePerDay}/day\n` +
        `Total: ₹${total}\n\n` +
        `Would you like me to confirm the booking?`,
      state,
    };
  }

  // ==========================================================
  // CITY AFTER CATEGORY
  //
  // Example:
  // "I need a bike tomorrow"
  // -> save bike + tomorrow
  // -> ask city
  //
  // "Ongole"
  // -> use saved bike
  // ==========================================================

  if (
    cityFromMessage &&
    state.category
  ) {
    const availableVehicles =
      getAvailableVehicles(
        state.city,
        state.category
      );

    state.waitingFor =
      null;

    if (!availableVehicles.length) {
      return {
        handled: true,
        reply:
          `Sorry, I couldn't find an available ${state.category} in ${state.city}.`,
        state,
      };
    }

    if (availableVehicles.length === 1) {
      const vehicle =
        availableVehicles[0];

      state.selectedVehicle =
        vehicle;

      state.waitingFor =
        "vehicle_confirmation";

      return {
        handled: true,
        reply:
          `We have ${vehicle.name} available in ${state.city} for ₹${vehicle.pricePerDay}/day. Would you like this one?`,
        state,
      };
    }
state.vehicleOptions = availableVehicles;
state.waitingFor = "vehicle";
    return {
      handled: true,
      reply:
        `We have these ${state.category}s available in ${state.city}:\n\n` +
        formatVehicleList(
          availableVehicles
        ) +
        `\n\nWhich one would you like?`,
      state,
    };
  }

  // ==========================================================
  // CITY WITHOUT CATEGORY
  // ==========================================================

  if (
    cityFromMessage &&
    !state.category
  ) {
    const cityVehicles =
      getAvailableVehicles(
        state.city,
        null
      );

    state.waitingFor =
      "category";

    return {
      handled: true,
      reply:
        `Sure. We have ${cityVehicles.length} vehicles available in ${state.city}. Would you like a car, bike, scooter or cycle?`,
      state,
    };
  }

  // ==========================================================
  // CATEGORY WITHOUT CITY
  // ==========================================================

  if (
    categoryFromMessage &&
    !state.city
  ) {
    state.waitingFor =
      "city";

    return {
      handled: true,
      reply:
        `Sure. Which city would you like the ${categoryFromMessage} in?`,
      state,
    };
  }

  // ==========================================================
  // CATEGORY + CITY
  // ==========================================================

  if (
    categoryFromMessage &&
    state.city
  ) {
    const availableVehicles =
      getAvailableVehicles(
        state.city,
        categoryFromMessage
      );

    if (!availableVehicles.length) {
      return {
        handled: true,
        reply:
          `Sorry, I couldn't find an available ${categoryFromMessage} in ${state.city}.`,
        state,
      };
    }

    if (
      availableVehicles.length === 1
    ) {
      const vehicle =
        availableVehicles[0];

      state.selectedVehicle =
        vehicle;

      state.category =
        vehicle.category;

      state.waitingFor =
        "vehicle_confirmation";

      return {
        handled: true,
        reply:
          `We have ${vehicle.name} available in ${state.city} for ₹${vehicle.pricePerDay}/day. Would you like this one?`,
        state,
      };
    }

    return {
      handled: true,
      reply:
        `Here are the available ${categoryFromMessage}s in ${state.city}:\n\n` +
        formatVehicleList(
          availableVehicles
        ) +
        `\n\nWhich one would you like?`,
      state,
    };
  }

  // ==========================================================
  // DATE WITHOUT CITY
  // ==========================================================

  if (
    state.rentalDate &&
    !state.city
  ) {
    state.waitingFor =
      "city";

    return {
      handled: true,
      reply:
        "Sure. Which city would you like to rent from?",
      state,
    };
  }

  // ==========================================================
  // DURATION WITHOUT VEHICLE
  // ==========================================================

  if (
    durationFromMessage &&
    !state.selectedVehicle
  ) {
    if (!state.city) {
      state.waitingFor =
        "city";

      return {
        handled: true,
        reply:
          "Sure. Which city would you like to rent from?",
        state,
      };
    }

    if (!state.category) {
      state.waitingFor =
        "category";

      return {
        handled: true,
        reply:
          "What type of vehicle would you like: car, bike, scooter or cycle?",
        state,
      };
    }
  }

  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  if (
    isAvailabilityQuestion(text)
  ) {
    if (!state.city) {
      state.waitingFor =
        "city";

      return {
        handled: true,
        reply:
          "Sure. Which city are you looking for?",
        state,
      };
    }

    const availableVehicles =
      getAvailableVehicles(
        state.city,
        state.category
      );

    if (!availableVehicles.length) {
      return {
        handled: true,
        reply:
          `Sorry, I couldn't find available vehicles matching your request in ${state.city}.`,
        state,
      };
    }

    return {
      handled: true,
      reply:
        `Here are the available vehicles in ${state.city}:\n\n` +
        formatVehicleList(
          availableVehicles
        ),
      state,
    };
  }

  // ==========================================================
  // PRICE
  // ==========================================================

  if (isPriceQuestion(text)) {
    if (state.selectedVehicle) {
      return {
        handled: true,
        reply:
          `${state.selectedVehicle.name} costs ₹${state.selectedVehicle.pricePerDay} per day.`,
        state,
      };
    }

    if (
      state.city &&
      state.category
    ) {
      const availableVehicles =
        getAvailableVehicles(
          state.city,
          state.category
        );

      if (availableVehicles.length) {
        return {
          handled: true,
          reply:
            `Here are the ${state.category} prices in ${state.city}:\n\n` +
            formatVehicleList(
              availableVehicles
            ),
          state,
        };
      }
    }
  }

  // ==========================================================
  // FALLBACK
  // ==========================================================

  return {
    handled: false,
    reply: null,
    state,
  };
}

// ============================================================
// GENERAL GROQ AI
// ============================================================

async function askGeneralAI(
  question,
  customerName = ""
) {
  const name =
    getCustomerName(customerName);

  let knowledgeText = "";

  if (knowledgeBase.length) {
    knowledgeText =
      knowledgeBase
        .map((doc) => doc.content)
        .join("\n\n")
        .slice(0, 12000);
  }

  const systemPrompt = `
You are Rentora AI, an AI-powered rental receptionist.

You help customers with rental questions in a natural, friendly and concise way.

IMPORTANT RULES:

1. Never invent rental vehicle availability.
2. Never invent vehicle prices.
3. Never invent cities.
4. Never claim a vehicle exists in a city unless the backend inventory confirms it.
5. Rental-specific booking decisions are handled by the backend rental engine.
6. For general questions, answer naturally.
7. Keep answers short and conversational.
8. Do not give huge lists unless the customer asks.
9. Ask only the next relevant question when appropriate.
10. Do not pretend that an unavailable vehicle is available.
11. Do not make up an exact pickup address.
12. If the customer asks something that is not related to rentals, answer helpfully but briefly.

Rentora currently operates in:

Chirala
Ongole
Vijayawada
Guntur
Nellore
Visakhapatnam
Tirupati

Rentora offers:

cars
motorbikes
scooters
cycles

${
  name
    ? `The customer's name is ${name}.`
    : ""
}

Knowledge base:
${knowledgeText}
`;

  try {
    const completion =
      await groq.chat.completions.create({
        model:
          "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],

        temperature: 0.3,
        max_tokens: 500,
      });

    return (
      completion.choices?.[0]?.message
        ?.content ||
      "I'm sorry, I couldn't generate a response right now."
    );
  } catch (error) {
    console.error(
      "Groq AI error:",
      error.message
    );

    return "I'm sorry, I'm having trouble responding right now. Please try again.";
  }
}

// ============================================================
// ROOT
// ============================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "VoiceRent backend is running!",
    assistant: "Rentora AI",
    status: "online",
  });
});

// ============================================================
// GET VEHICLES
// ============================================================

app.get(
  "/api/vehicles",
  (req, res) => {
    res.json({
      success: true,
      vehicles,
    });
  }
);

// ============================================================
// GET AVAILABILITY
// ============================================================

app.get(
  "/api/availability",
  (req, res) => {
    const city =
      req.query.city || null;

    const category =
      req.query.category || null;

    const availableVehicles =
      getAvailableVehicles(
        city,
        category
      );

    res.json({
      success: true,
      city,
      category,
      vehicles:
        availableVehicles,
    });
  }
);

// ============================================================
// UNDERSTAND BOOKING
// ============================================================

app.post(
  "/api/ai/understand",
  async (req, res) => {
    try {
      const {
        message,
        text,
        sessionId = "default",
      } = req.body;

      const userMessage =
        message || text || "";

      if (!userMessage.trim()) {
        return res.status(400).json({
          success: false,
          error:
            "Message is required.",
        });
      }

      const state =
        getConversation(
          sessionId
        );

      const city =
        findCity(userMessage);

      const category =
        detectVehicleCategory(
          userMessage
        );

      const durationDays =
        extractDuration(
          userMessage
        );

      const rentalDate =
        detectRentalDate(
          userMessage
        );

      if (city) {
        state.city = city;
      }

      if (category) {
        state.category =
          category;
      }

      if (durationDays) {
        state.durationDays =
          durationDays;
      }

      if (rentalDate) {
        state.rentalDate =
          rentalDate;
      }

      res.json({
        success: true,

        bookingDetails: {
          city:
            state.city,

          vehicleType:
            state.category,

          durationDays:
            state.durationDays,

          date:
            state.rentalDate,

          selectedVehicle:
            state.selectedVehicle,
        },
      });
    } catch (error) {
      console.error(
        "Understand booking error:",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Could not understand the booking request.",
      });
    }
  }
);

// ============================================================
// AI ANSWER
// ============================================================

app.post(
  "/api/ai/answer",
  async (req, res) => {
    try {
      const {
        message,
        text,
        sessionId = "default",
        customerName = "",
      } = req.body;

      const userMessage =
        message || text || "";

      if (!userMessage.trim()) {
        return res.status(400).json({
          success: false,
          error:
            "Message is required.",
        });
      }

      const rentalResult =
        handleRentalConversation(
          userMessage,
          sessionId,
          customerName
        );

      if (rentalResult.handled) {
        return res.json({
          success: true,
          reply:
            rentalResult.reply,

          state:
            rentalResult.state,

          booking:
            rentalResult.booking ||
            null,
        });
      }

      const aiReply =
        await askGeneralAI(
          userMessage,
          customerName
        );

      res.json({
        success: true,
        reply: aiReply,
        state:
          getConversation(
            sessionId
          ),
      });
    } catch (error) {
      console.error(
        "AI answer error:",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "AI could not process your request.",
      });
    }
  }
);

// ============================================================
// GET BOOKINGS
// ============================================================

app.get(
  "/api/bookings",
  (req, res) => {
    res.json({
      success: true,
      bookings,
    });
  }
);

// ============================================================
// REGISTER
// ============================================================

app.post(
  "/api/auth/register",
  (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Name, email and password are required.",
        });
      }

      const customers =
        loadCustomers();

      const existingCustomer =
        customers.find(
          (customer) =>
            customer.email.toLowerCase() ===
            email.toLowerCase()
        );

      if (existingCustomer) {
        return res.status(409).json({
          success: false,
          error:
            "An account with this email already exists.",
        });
      }

      const customer = {
        id: `CUS-${Date.now()}`,
        name,
        email:
          email.toLowerCase(),
        password:
          hashPassword(password),
        createdAt:
          new Date().toISOString(),
      };

      customers.push(customer);

      saveCustomers(
        customers
      );

      res.json({
        success: true,
        message:
          "Account created successfully.",

        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
      });
    } catch (error) {
      console.error(
        "Register error:",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Could not create account.",
      });
    }
  }
);

// ============================================================
// LOGIN
// ============================================================

app.post(
  "/api/auth/login",
  (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Email and password are required.",
        });
      }

      const customers =
        loadCustomers();

      const customer =
        customers.find(
          (item) =>
            item.email.toLowerCase() ===
            email.toLowerCase()
        );

      if (!customer) {
        return res.status(401).json({
          success: false,
          error:
            "Invalid email or password.",
        });
      }

      const passwordHash =
        hashPassword(password);

      if (
        customer.password !==
        passwordHash
      ) {
        return res.status(401).json({
          success: false,
          error:
            "Invalid email or password.",
        });
      }

      res.json({
        success: true,
        message:
          "Login successful.",

        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Could not log in.",
      });
    }
  }
);

// ============================================================
// TRANSCRIBE AUDIO USING GROQ WHISPER
// ============================================================

app.post(
  "/api/transcribe",
  upload.single("audio"),
  async (req, res) => {
    let tempFilePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error:
            "Audio file is required.",
        });
      }

      const tempDirectory =
        path.join(
          __dirname,
          "temp"
        );

      if (
        !fs.existsSync(
          tempDirectory
        )
      ) {
        fs.mkdirSync(
          tempDirectory,
          {
            recursive: true,
          }
        );
      }

      const fileName =
        `audio-${Date.now()}.webm`;

      tempFilePath =
        path.join(
          tempDirectory,
          fileName
        );

      fs.writeFileSync(
        tempFilePath,
        req.file.buffer
      );

      const transcription =
        await groq.audio.transcriptions.create(
          {
            file:
              fs.createReadStream(
                tempFilePath
              ),

            model:
              "whisper-large-v3-turbo",

            response_format:
              "json",
          }
        );

      if (
        fs.existsSync(
          tempFilePath
        )
      ) {
        fs.unlinkSync(
          tempFilePath
        );
      }

      res.json({
        success: true,
        text:
          transcription.text ||
          "",
      });
    } catch (error) {
      console.error(
        "Transcription error:",
        error.message
      );

      if (
        tempFilePath &&
        fs.existsSync(
          tempFilePath
        )
      ) {
        try {
          fs.unlinkSync(
            tempFilePath
          );
        } catch (
          cleanupError
        ) {
          console.error(
            "Could not remove temporary file:",
            cleanupError.message
          );
        }
      }

      res.status(500).json({
        success: false,
        error:
          "Could not transcribe the audio.",
      });
    }
  }
);

// ============================================================
// RESET CONVERSATION
// ============================================================

app.post(
  "/api/ai/reset",
  (req, res) => {
    const {
      sessionId = "default",
    } = req.body;

    resetConversation(
      sessionId
    );

    res.json({
      success: true,
      message:
        "Conversation reset successfully.",

      state:
        getConversation(
          sessionId
        ),
    });
  }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {
    console.log(
      "=============================================="
    );

    console.log(
      "        RENTORA AI BACKEND SERVER"
    );

    console.log(
      "=============================================="
    );

    console.log(
      `Server running on http://localhost:${PORT}`
    );

    console.log(
      "Groq AI: Connected"
    );

    console.log(
      "Whisper transcription: Ready"
    );

    console.log(
      `Vehicles loaded: ${vehicles.length}`
    );

    console.log(
      "=============================================="
    );
  }
);