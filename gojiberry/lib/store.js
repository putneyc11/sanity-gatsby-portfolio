import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");

function fileFor(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readJson(name, fallback) {
  try {
    return JSON.parse(fs.readFileSync(fileFor(name), "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(name, value) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = fileFor(name) + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, fileFor(name));
}

export const DEFAULT_PROFILE = {
  businessName: "",
  whatYouSell: "",
  targetCustomer: "",
  valueProp: "",
  proofPoints: "",
  callToAction: "",
  senderName: "",
  senderRole: "",
  tone: "friendly and direct"
};

export function getProfile() {
  return { ...DEFAULT_PROFILE, ...readJson("profile", {}) };
}

export function saveProfile(patch) {
  const profile = { ...getProfile() };
  for (const key of Object.keys(DEFAULT_PROFILE)) {
    if (typeof patch[key] === "string") profile[key] = patch[key].trim();
  }
  writeJson("profile", profile);
  return profile;
}

export function getLeads() {
  return readJson("leads", []);
}

const LEAD_FIELDS = ["name", "title", "company", "email", "industry", "website", "notes"];

export function addLead(input) {
  const lead = { id: crypto.randomUUID(), status: "new", createdAt: new Date().toISOString() };
  for (const key of LEAD_FIELDS) lead[key] = typeof input[key] === "string" ? input[key].trim() : "";
  if (!lead.name && !lead.company) return null;
  const leads = getLeads();
  leads.unshift(lead);
  writeJson("leads", leads);
  return lead;
}

export function updateLead(id, patch) {
  const leads = getLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  for (const key of [...LEAD_FIELDS, "status", "lastEmail"]) {
    if (typeof patch[key] === "string") lead[key] = patch[key];
  }
  writeJson("leads", leads);
  return lead;
}

export function deleteLead(id) {
  const leads = getLeads();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false;
  writeJson("leads", next);
  return true;
}

export function getLead(id) {
  return getLeads().find((l) => l.id === id) || null;
}

// Minimal CSV parser that handles quoted fields and embedded commas/newlines.
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

const HEADER_ALIASES = {
  name: ["name", "full name", "contact", "contact name", "first name"],
  title: ["title", "job title", "role", "position"],
  company: ["company", "company name", "organization", "org", "account"],
  email: ["email", "email address", "e-mail"],
  industry: ["industry", "sector", "vertical"],
  website: ["website", "url", "domain", "site"],
  notes: ["notes", "note", "comments", "context"]
};

export function importCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return { imported: 0, skipped: 0 };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const columnMap = {};
  header.forEach((h, i) => {
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (aliases.includes(h) && !(field in columnMap)) columnMap[field] = i;
    }
  });
  let imported = 0;
  let skipped = 0;
  for (const row of rows.slice(1)) {
    const input = {};
    for (const [field, i] of Object.entries(columnMap)) input[field] = row[i] || "";
    if (addLead(input)) imported++;
    else skipped++;
  }
  return { imported, skipped };
}
