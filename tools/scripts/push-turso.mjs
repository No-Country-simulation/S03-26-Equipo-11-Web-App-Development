import { spawn } from "child_process";

const proc = spawn("npx", ["drizzle-kit", "push"], {
  cwd: process.cwd(),
  stdio: ["pipe", "inherit", "inherit"],
});

proc.stdin?.write("Yes, I want to remove 2 tables, remove 2 columns, truncate 1 table\n");
proc.stdin?.end();