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
    const build = spawnSync("npm", ["run", "--silent", "build"], {
      stdio: ["ignore", "inherit", "inherit"],
    });
    if (build.error ?? build.status) {
      return console.error(build.error ?? `Exited with ${build.status}`);
    }
    console.log("Starting server...");
    proc = spawn(
      join(__dirname, "dist", "main.js"),
      ["--admin", "8153", "--dns", "5353", "--state", ".dev-state"],
      {
        cwd: __dirname,
        stdio: ["ignore", "inherit", "inherit"],
      }
    );
  }, 400);
});
