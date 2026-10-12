import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sites } from "./data.js";
import { buildingsHandler } from "./buildings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Automatic status rules (edit thresholds here)
const CONFIRM_AT = 0.85;
const REVIEW_AT = 0.7;

function evaluateStatus(site) {
  if (site.permitOnFile) return "dismissed";
  if (site.confidence >= CONFIRM_AT) return "confirmed";
  if (site.confidence >= REVIEW_AT) return "reviewing";
  return "flagged";
}

// Recalculate every status before any API response
app.use("/api", (req, res, next) => {
  for (const s of sites) s.status = evaluateStatus(s);
  next();
});

app.get("/api/sites", (req, res) => {
  const { status } = req.query;
  const result = status ? sites.filter((s) => s.status === status) : sites;
  res.json(result);
});

app.get("/api/sites/:id", (req, res) => {
  const site = sites.find((s) => s.id === req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  res.json(site);
});

app.get("/api/buildings", buildingsHandler);

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

