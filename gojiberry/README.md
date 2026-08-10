# 🍒 Gojiberry — AI Sales Outreach

Gojiberry is a small self-hosted tool that writes personalized sales outreach emails for your business using Claude. Add leads (or import a CSV), describe your business once, and generate first-touch cold emails, follow-ups, break-up emails, or full 3-email sequences — streamed live and personalized to each lead.

## Quick start

```bash
cd gojiberry
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # get one at https://platform.claude.com
npm start
```

Then open **http://localhost:4646**.

1. Go to **Business setup** and describe what you sell, who you sell to, and your call to action. This profile drives every email.
2. Go to **Leads** and add a lead by hand, or click **Import CSV** (see `sample-leads.csv` for the format — columns are matched by name, extra columns are ignored).
3. Select a lead, pick an email type and optional tone, and click **Generate with AI**. The email streams in as it's written. Copy it into your email client of choice.

## Features

- **Lead list** with statuses (`new` → `drafted`), stored locally in `data/leads.json` — no database needed
- **CSV import** with flexible header matching (`name`, `title`, `company`, `email`, `industry`, `website`, `notes`)
- **Business profile** so every email reflects your actual value prop, proof points, and CTA
- **Four email types**: cold first-touch, follow-up, break-up, and a full 3-email sequence
- **Per-email overrides**: tone and free-form extra instructions (e.g. "mention their recent funding round")
- **Live streaming** output from Claude, with the last email saved on each lead

## Configuration

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | — | Required for generation. The UI works without it, but generating emails is disabled. |
| `GOJIBERRY_MODEL` | `claude-opus-5` | Claude model used for generation. |
| `PORT` | `4646` | HTTP port. |

## Notes

- All data stays on your machine in `gojiberry/data/` (gitignored). Delete that folder to reset.
- Emails are drafts: Gojiberry never sends anything on your behalf. Review before you hit send.
- The generator is instructed to never invent facts about a lead — the more real context you put in a lead's **notes**, the better the personalization.
