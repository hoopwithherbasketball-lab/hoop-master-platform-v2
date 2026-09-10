#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const workspaces = [
  "packages/types",
  "packages/supabase",
  "packages/ui",
  "packages/features",
  "services/ad-insertion",
  "services/analytics-ingester",
  "services/epg-generator",
  "services/playlist-engine",
  "services/api",
  "apps/procoach",
  "apps/web",
  "apps/partner-portal",
];

let failed = [];

for (const ws of workspaces) {
  const wsPath = path.join(root, ws);
  if (!fs.existsSync(path.join(wsPath, "package.json"))) continue;

  const pkg = JSON.parse(fs.readFileSync(path.join(wsPath, "package.json"), "utf8"));
  if (!pkg.scripts || !pkg.scripts.build) continue;

  console.log(`\n> ${pkg.name} build`);
  try {
    execSync("npm run build --silent", {
      cwd: wsPath,
      stdio: "inherit",
      env: { ...process.env },
    });
  } catch (e) {
    failed.push(pkg.name);
  }
}

if (failed.length > 0) {
  console.error(`\nBuild failed for: ${failed.join(", ")}`);
  process.exit(1);
}

console.log("\nAll builds completed successfully.");
