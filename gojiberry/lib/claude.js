import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.GOJIBERRY_MODEL || "claude-opus-5";

let client = null;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

export function hasApiKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

const EMAIL_TYPES = {
  cold: "a first-touch cold outreach email",
  followup: "a polite follow-up email to a previous cold email that got no reply",
  breakup: "a short, graceful final 'break-up' email after several unanswered attempts",
  sequence: "a 3-email outreach sequence: a first-touch cold email, a follow-up 3 days later, and a final break-up email a week after that"
};

function buildSystemPrompt(profile) {
  return `You are Gojiberry, an expert B2B sales copywriter. You write outreach emails on behalf of the business described below.

<business>
Business name: ${profile.businessName || "(not set)"}
What they sell: ${profile.whatYouSell || "(not set)"}
Target customer: ${profile.targetCustomer || "(not set)"}
Value proposition: ${profile.valueProp || "(not set)"}
Proof points: ${profile.proofPoints || "(none provided)"}
Preferred call to action: ${profile.callToAction || "(not set)"}
Sender: ${profile.senderName || "(not set)"}${profile.senderRole ? `, ${profile.senderRole}` : ""}
Default tone: ${profile.tone || "friendly and direct"}
</business>

Rules for every email you write:
- Personalize to the specific lead using the details provided; never invent facts about the lead or fabricate statistics.
- Keep cold emails under 120 words, follow-ups under 80 words. Short paragraphs, no fluff.
- Subject lines: under 7 words, specific, no clickbait and no ALL CAPS.
- One clear call to action per email, based on the business's preferred CTA.
- Sound like a human colleague, not a marketing blast. No "I hope this email finds you well." No buzzwords.
- Sign off with the sender's name.

Output format: start each email with "Subject: ..." on its own line, then a blank line, then the body. For a sequence, separate the emails with a line containing only "---" and label each ("Email 1 — Day 0", "Email 2 — Day 3", "Email 3 — Day 10").
Output only the email content — no commentary before or after.`;
}

function buildUserMessage(lead, options) {
  const type = EMAIL_TYPES[options.type] ? options.type : "cold";
  const lines = [
    `Write ${EMAIL_TYPES[type]}.`,
    "",
    "<lead>",
    `Name: ${lead.name || "(unknown)"}`,
    lead.title ? `Title: ${lead.title}` : null,
    lead.company ? `Company: ${lead.company}` : null,
    lead.industry ? `Industry: ${lead.industry}` : null,
    lead.website ? `Website: ${lead.website}` : null,
    lead.notes ? `Notes / context: ${lead.notes}` : null,
    "</lead>"
  ].filter(Boolean);
  if (options.tone) lines.push("", `Use this tone: ${options.tone}.`);
  if (options.instructions) lines.push("", `Additional instructions: ${options.instructions}`);
  return lines.join("\n");
}

// Streams the generated email, invoking onText for each text delta.
// Returns the full generated text.
export async function generateEmail(profile, lead, options, onText) {
  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(profile),
    messages: [{ role: "user", content: buildUserMessage(lead, options) }]
  });

  stream.on("text", (delta) => onText(delta));

  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") {
    throw new Error("The model declined to generate this email. Adjust the lead notes or instructions and try again.");
  }
  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}
