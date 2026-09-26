/**
 * MealPlan.io - Firebase Realtime Synchronization Module
 * Spazio Casa / Coppia per la sincronizzazione real-time di:
 * - Ricettario e piatti abituali
 * - Pianificazione pasti settimanali
 * - Spunte lista della spesa e giacenze parziali
 * - Listino ortofrutta del fruttivendolo
 */

const firebaseConfig = {
  apiKey: "AIzaSyAJaMIpxdLfQpVLS-8Idjrex6oDDEY_pBM",
  authDomain: "mealplan-app-9f599.firebaseapp.com",
  projectId: "mealplan-app-9f599",
  storageBucket: "mealplan-app-9f599.firebasestorage.app",
  messagingSenderId: "222841434371",
  appId: "1:222841434371:web:19fa7dfb8517156dd23936"
};

// Inizializzazione Firebase
let db = null;
try {
  if (typeof firebase !== "undefined" && firebase.initializeApp) {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log("[Firebase] Firestore inizializzato con successo.");
  }
} catch (e) {
  console.warn("[Firebase] Inizializzazione fallita o offline:", e);
}

// Costanti Storage
const STORAGE_KEY_HOUSE_CODE = "shared_house_code";
const STORAGE_KEY_DEVICE_ID = "mealplan_device_id";

// Identificatore univoco del dispositivo per evitare loop di echo
function getDeviceId() {
  let id = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
  if (!id) {
    id = "dev_" + Math.random().toString(36).substring(2, 11);
    try { localStorage.setItem(STORAGE_KEY_DEVICE_ID, id); } catch (e) {}
  }
  return id;
}

// Sanitizzazione Document ID (accetta solo [A-Z0-9-] in maiuscolo)
function sanitizeHouseCode(code) {
  if (!code || typeof code !== "string") return "";
  return code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// Validazione Document ID: lunghezza >= 6 e caratteri alfanumerici con trattini
function isValidHouseCode(code) {
  const sanitized = sanitizeHouseCode(code);
  return sanitized.length >= 6 && sanitized.length <= 32 && /^[A-Z0-9]+(-[A-Z0-9]+)*$/.test(sanitized);
}

// Generatore codice casa compatto (es. CASA-4K9P)
function generateHouseCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CASA-${rand}`;
}

// Esporta oggetto FirebaseSync per integrazione modulare
window.FirebaseSync = {
  config: firebaseConfig,
  getDb: () => db,
  getDeviceId,
  sanitizeHouseCode,
  isValidHouseCode,
  generateHouseCode
};
