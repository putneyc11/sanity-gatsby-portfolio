import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getProfile, saveProfile,
  getLeads, getLead, addLead, updateLead, deleteLead, importCsv
} from "./lib/store.js";
import { generateEmail, hasApiKey } from "./lib/claude.js";

const PORT = Number(process.env.PORT) || 4646;
const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".csv": "text/csv; charset=utf-8"
};

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(data);
}

function readBody(req, limit = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  const raw = await readBody(req);
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error("Invalid JSON body");
  }
}

async function handleApi(req, res, url) {
  const { pathname } = url;
  const method = req.method;

  if (pathname === "/api/status" && method === "GET") {
    return sendJson(res, 200, { ok: true, apiKeyConfigured: hasApiKey() });
  }

  if (pathname === "/api/profile") {
    if (method === "GET") return sendJson(res, 200, getProfile());
    if (method === "PUT") return sendJson(res, 200, saveProfile(await readJsonBody(req)));
  }

  if (pathname === "/api/leads" && method === "GET") {
    return sendJson(res, 200, getLeads());
  }
  if (pathname === "/api/leads" && method === "POST") {
    const lead = addLead(await readJsonBody(req));
    if (!lead) return sendJson(res, 400, { error: "A lead needs at least a name or a company." });
    return sendJson(res, 201, lead);
  }
  if (pathname === "/api/leads/import" && method === "POST") {
    const result = importCsv(await readBody(req));
    return sendJson(res, 200, result);
  }

  const leadMatch = pathname.match(/^\/api\/leads\/([0-9a-f-]{36})$/);
  if (leadMatch) {
    const id = leadMatch[1];
    if (method === "PATCH") {
      const lead = updateLead(id, await readJsonBody(req));
      return lead ? sendJson(res, 200, lead) : sendJson(res, 404, { error: "Lead not found" });
    }
    if (method === "DELETE") {
      return deleteLead(id) ? sendJson(res, 200, { ok: true }) : sendJson(res, 404, { error: "Lead not found" });
    }
  }

  if (pathname === "/api/generate" && method === "POST") {
    const body = await readJsonBody(req);
    const lead = body.leadId ? getLead(body.leadId) : null;
    if (!lead) return sendJson(res, 404, { error: "Lead not found" });
    if (!hasApiKey()) {
      return sendJson(res, 400, {
        error: "No Anthropic API key configured. Set the ANTHROPIC_API_KEY environment variable and restart the server."
      });
    }

    // Server-sent events: stream text deltas to the browser as Claude writes.
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    try {
      const options = {
        type: body.type,
        tone: typeof body.tone === "string" ? body.tone.slice(0, 200) : "",
        instructions: typeof body.instructions === "string" ? body.instructions.slice(0, 2000) : ""
      };
      const text = await generateEmail(getProfile(), lead, options, (delta) => send("delta", { text: delta }));
      updateLead(lead.id, { lastEmail: text, status: lead.status === "new" ? "drafted" : lead.status });
      send("done", { text });
    } catch (err) {
      send("error", { error: err?.message || "Generation failed" });
    }
    return res.end();
  }

  sendJson(res, 404, { error: "Not found" });
}

function serveStatic(req, res, url) {
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const absolute = path.join(PUBLIC_DIR, filePath);
  if (!absolute.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(absolute, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(absolute)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
    } else {
      serveStatic(req, res, url);
    }
  } catch (err) {
    if (!res.headersSent) sendJson(res, 500, { error: err?.message || "Server error" });
    else res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Gojiberry running at http://localhost:${PORT}`);
  if (!hasApiKey()) {
    console.log("Note: ANTHROPIC_API_KEY is not set — email generation is disabled until you set it.");
  }
});
