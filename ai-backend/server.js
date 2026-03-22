import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PORT = process.env.PORT || 3001;

function safeString(value) {
  return typeof value === "string" ? value : "";
}

function safeBoolean(value) {
  return Boolean(value);
}

function safeNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeFieldType(value) {
  const allowed = ["short-text", "long-text", "dropdown", "date", "file-upload"];
  return allowed.includes(value) ? value : "short-text";
}

function normalizeTemplateFields(fields) {
  if (!Array.isArray(fields)) return [];
  return fields.map((field, index) => ({
    id: `ai-field-${index + 1}`,
    label: safeString(field?.label),
    fieldType: normalizeFieldType(field?.fieldType),
    required: safeBoolean(field?.required),
    hasCharacterLimit: safeBoolean(field?.hasCharacterLimit),
    characterLimit: safeNumberOrNull(field?.characterLimit),
    placeholder: safeString(field?.placeholder),
    dropdownOptions: Array.isArray(field?.dropdownOptions)
      ? field.dropdownOptions.map(String).filter(Boolean)
      : [],
    acceptedFileTypes: Array.isArray(field?.acceptedFileTypes)
      ? field.acceptedFileTypes.map(String).filter(Boolean)
      : [],
    maxFileSizeMB: safeNumberOrNull(field?.maxFileSizeMB) ?? 10
  }));
}

function normalizeMilestones(milestones) {
  if (!Array.isArray(milestones)) return [];
  return milestones.map((m, index) => ({
    id: `ai-milestone-${index + 1}`,
    name: safeString(m?.name),
    date: safeString(m?.date),
    requiresUpload: safeBoolean(m?.requiresUpload)
  }));
}

function normalizeCourseExtract(data) {
  return {
    title: safeString(data?.title),
    courseCode: safeString(data?.courseCode),
    semester: safeString(data?.semester),
    startDate: safeString(data?.startDate),
    endDate: safeString(data?.endDate),
    proposalDeadline: safeString(data?.proposalDeadline),
    description: safeString(data?.description),
    templateFields: normalizeTemplateFields(data?.templateFields),
    milestones: normalizeMilestones(data?.milestones)
  };
}

function extractJson(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in model response");
  }
  return match[0];
}

app.get("/", (req, res) => {
  res.json({ ok: true, message: "AI backend is running" });
});

app.post("/api/test-openai", async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: "Say hello in one sentence."
        }
      ]
    });

    const result = completion.choices[0]?.message?.content || "";
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI call failed" });
  }
});

app.post("/api/ai/course-extract", async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: "rawText is required" });
    }

    const prompt = `
You extract structured course setup data from pasted university course content.

Return only valid JSON.
Do not use markdown.
Do not wrap the JSON in code fences.

Use exactly this structure:
{
  "title": "",
  "courseCode": "",
  "semester": "",
  "startDate": "",
  "endDate": "",
  "proposalDeadline": "",
  "description": "",
  "templateFields": [
    {
      "label": "",
      "fieldType": "short-text",
      "required": true,
      "hasCharacterLimit": false,
      "characterLimit": null,
      "placeholder": "",
      "dropdownOptions": [],
      "acceptedFileTypes": [],
      "maxFileSizeMB": 10
    }
  ],
  "milestones": [
    {
      "name": "",
      "date": "",
      "requiresUpload": false
    }
  ]
}

Rules:
- Dates must be YYYY-MM-DD when possible. Otherwise return "".
- fieldType must be one of: "short-text", "long-text", "dropdown", "date", "file-upload".
- If information is missing, use "" or [] or null.
- This is a university-company collaboration platform.
- Infer reasonable proposal template fields for companies from the course text.
- Infer reasonable milestones from the course text if possible.
- Keep description concise and professional for companies.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: rawText }
      ]
    });

    const content = completion.choices[0]?.message?.content || "";
    const jsonText = extractJson(content);
    const parsed = JSON.parse(jsonText);
    const normalized = normalizeCourseExtract(parsed);

    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "course extraction failed" });
  }
});

app.post("/api/ai/polish-course-description", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ error: "description is required" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
Rewrite the course description for companies.
Make it clear, professional, concise, and suitable for an industry-facing platform.
Return plain text only.
`
        },
        {
          role: "user",
          content: description
        }
      ]
    });

    const polishedDescription = completion.choices[0]?.message?.content || "";
    res.json({ polishedDescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "description polish failed" });
  }
});

app.listen(PORT, () => {
    console.log(`AI backend running on http://localhost:${PORT}`);
});