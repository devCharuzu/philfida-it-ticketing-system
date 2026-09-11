import { spawnSync } from "node:child_process";
import "dotenv/config";

const container = "philfida-postgres";
const image = "postgres:16-alpine";
const password = process.env.POSTGRES_PASSWORD ?? "philfida_local_change_me";
const action = process.argv[2] ?? "up";
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function docker(args, silent = false) {
  const result = spawnSync("docker", args, {
    encoding: "utf8",
    stdio: silent ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  if (result.error) {
    throw new Error("Docker is not installed or is not running. Install/start Docker Desktop or use PostgreSQL installed directly.");
  }
  return result;
}

if (docker(["info"], true).status !== 0) {
  throw new Error("Docker is not running. Start Docker Desktop or Colima and try again.");
}

const existing = docker(["container", "inspect", container], true).status === 0;

if (action === "up") {
  if (existing) {
    docker(["start", container]);
  } else {
    docker([
      "run",
      "--detach",
      "--name",
      container,
      "--restart",
      "unless-stopped",
      "--env",
      "POSTGRES_DB=philfida_it",
      "--env",
      "POSTGRES_USER=philfida",
      "--env",
      `POSTGRES_PASSWORD=${password}`,
      "--publish",
      "127.0.0.1:5432:5432",
      "--volume",
      "philfida_pgdata:/var/lib/postgresql/data",
      image,
    ]);
  }
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    ready = docker(["exec", container, "pg_isready", "-U", "philfida", "-d", "philfida_it"], true).status === 0;
    if (ready) break;
    await sleep(1000);
  }
  if (!ready) throw new Error("PostgreSQL container started but did not become ready within 30 seconds.");
  console.log("Local PostgreSQL is running in Docker as philfida-postgres.");
} else if (action === "down") {
  if (existing) docker(["stop", container]);
  console.log("Local PostgreSQL stopped. Its Docker volume was kept.");
} else {
  throw new Error(`Unknown database action: ${action}. Use up or down.`);
}
