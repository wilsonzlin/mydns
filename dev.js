const { spawn, spawnSync } = require("child_process");
const chokidar = require("chokidar");
const { join } = require("path");

let proc;
let procDebounce;
chokidar.watch(join(__dirname, "src")).on("all", (event, path) => {
  console.log(event, path);
  clearTimeout(procDebounce);
  procDebounce = setTimeout(() => {
    proc?.kill();
    try {
      spawnSync("npm", ["run", "build"], {
        stdio: ["ignore", "inherit", "inherit"],
      });
    } catch (e) {
      return console.error(e);
    }
    console.log("Starting server...");
    proc = spawn(
      join(__dirname, "dist", "main.js"),
      ["--admin", "4444", "--dns", "5353", "--state", ".dev-state"],
      {
        cwd: __dirname,
        stdio: ["ignore", "inherit", "inherit"],
      }
    );
  }, 400);
});
