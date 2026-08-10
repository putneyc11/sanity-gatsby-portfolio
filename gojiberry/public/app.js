const $ = (sel) => document.querySelector(sel);

let leads = [];
let selectedId = null;
let generating = false;

// ---------- helpers ----------

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: options.body && !options.raw ? { "Content-Type": "application/json" } : undefined,
    ...options,
    body: options.raw ? options.body : options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- tabs ----------

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".tab-panel").forEach((p) => (p.hidden = p.id !== `tab-${btn.dataset.tab}`));
  });
});

// ---------- leads ----------

function renderLeads() {
  const list = $("#lead-list");
  list.innerHTML = "";
  $("#lead-empty").hidden = leads.length > 0;
  for (const lead of leads) {
    const li = document.createElement("li");
    li.className = "lead-item" + (lead.id === selectedId ? " selected" : "");
    const meta = [lead.title, lead.company].filter(Boolean).join(" · ");
    li.innerHTML = `
      <div class="lead-main">
        <div class="lead-name">${escapeHtml(lead.name || lead.company)}</div>
        <div class="lead-meta">${escapeHtml(meta || lead.email || "")}</div>
      </div>
      <span class="lead-status" data-status="${escapeHtml(lead.status)}">${escapeHtml(lead.status)}</span>
      <button class="lead-delete" title="Delete lead">✕</button>`;
    li.addEventListener("click", () => selectLead(lead.id));
    li.querySelector(".lead-delete").addEventListener("click", async (e) => {
      e.stopPropagation();
      await api(`/api/leads/${lead.id}`, { method: "DELETE" });
      if (selectedId === lead.id) selectLead(null);
      await loadLeads();
    });
    list.appendChild(li);
  }
}

function selectLead(id) {
  selectedId = id;
  const lead = leads.find((l) => l.id === id);
  $("#compose-empty").hidden = Boolean(lead);
  $("#compose").hidden = !lead;
  if (lead) {
    const bits = [lead.name, lead.title, lead.company, lead.industry, lead.email].filter(Boolean);
    $("#compose-lead-summary").innerHTML =
      `<strong>${escapeHtml(lead.name || lead.company)}</strong> — ${escapeHtml(bits.slice(1).join(" · ") || "no details")}` +
      (lead.notes ? `<br><span style="color:var(--ink-soft)">${escapeHtml(lead.notes)}</span>` : "");
    const out = $("#output");
    out.hidden = !lead.lastEmail;
    out.textContent = lead.lastEmail || "";
    $("#btn-copy").hidden = !lead.lastEmail;
    $("#gen-status").textContent = "";
  }
  renderLeads();
}

async function loadLeads() {
  leads = await api("/api/leads");
  renderLeads();
}

$("#btn-toggle-add").addEventListener("click", () => {
  const form = $("#add-lead-form");
  form.hidden = !form.hidden;
});

$("#add-lead-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    const lead = await api("/api/leads", { method: "POST", body });
    form.reset();
    form.hidden = true;
    await loadLeads();
    selectLead(lead.id);
  } catch (err) {
    alert(err.message);
  }
});

$("#csv-input").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    const { imported, skipped } = await api("/api/leads/import", { method: "POST", body: text, raw: true });
    alert(`Imported ${imported} lead${imported === 1 ? "" : "s"}${skipped ? `, skipped ${skipped} row(s)` : ""}.`);
    await loadLeads();
  } catch (err) {
    alert(`Import failed: ${err.message}`);
  }
  e.target.value = "";
});

// ---------- generation (SSE over fetch) ----------

$("#btn-generate").addEventListener("click", async () => {
  if (generating || !selectedId) return;
  generating = true;
  const btn = $("#btn-generate");
  const out = $("#output");
  const status = $("#gen-status");
  btn.disabled = true;
  status.className = "gen-status";
  status.textContent = "Writing…";
  out.hidden = false;
  out.textContent = "";
  $("#btn-copy").hidden = true;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: selectedId,
        type: $("#gen-type").value,
        tone: $("#gen-tone").value,
        instructions: $("#gen-instructions").value
      })
    });
    if (!res.ok || !res.headers.get("content-type")?.includes("text/event-stream")) {
      const data = await res.json();
      throw new Error(data.error || "Generation failed");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;
    while (!done) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop();
      for (const raw of events) {
        const eventMatch = raw.match(/^event: (.+)$/m);
        const dataMatch = raw.match(/^data: (.+)$/m);
        if (!eventMatch || !dataMatch) continue;
        const payload = JSON.parse(dataMatch[1]);
        if (eventMatch[1] === "delta") {
          out.textContent += payload.text;
          out.scrollTop = out.scrollHeight;
        } else if (eventMatch[1] === "done") {
          out.textContent = payload.text;
          done = true;
        } else if (eventMatch[1] === "error") {
          throw new Error(payload.error);
        }
      }
    }
    status.textContent = "Done";
    $("#btn-copy").hidden = false;
    await loadLeads();
  } catch (err) {
    status.className = "gen-status error";
    status.textContent = err.message;
  } finally {
    generating = false;
    btn.disabled = false;
  }
});

$("#btn-copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("#output").textContent);
  $("#gen-status").textContent = "Copied to clipboard";
});

// ---------- profile ----------

async function loadProfile() {
  const profile = await api("/api/profile");
  const form = $("#profile-form");
  for (const [key, value] of Object.entries(profile)) {
    if (form.elements[key]) form.elements[key].value = value;
  }
}

$("#profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.target).entries());
  await api("/api/profile", { method: "PUT", body });
  const status = $("#profile-status");
  status.textContent = "Saved ✓";
  setTimeout(() => (status.textContent = ""), 2500);
});

// ---------- init ----------

(async function init() {
  try {
    const { apiKeyConfigured } = await api("/api/status");
    $("#key-status").hidden = apiKeyConfigured;
  } catch { /* status banner stays hidden */ }
  await Promise.all([loadLeads(), loadProfile()]);
})();
