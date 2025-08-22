/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const { execSync } = require("child_process");

const [, , path, name] = process.argv;

if (!path || !name) {
  console.error("Usage: node scripts/generate-migration.js <path> <name>");
  process.exit(1);
}

execSync(`npx typeorm-ts-node-commonjs -d orm/orm-migration.config.ts migration:generate ${path}/migrations/${name}`, {
  stdio: "inherit",
});
