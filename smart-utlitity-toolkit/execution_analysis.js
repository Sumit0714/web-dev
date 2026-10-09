// Execution Flow & Console Analysis
// Demonstrates CLI inputs, file operations, HTTP requests,
// console logging, and synchronous vs asynchronous execution.

const fs = require("fs");
const path = require("path");
const http = require("http");
const log = require("./modules/logger");

const filePath = path.join(__dirname, "execution-analysis.txt");
const args = process.argv.slice(2);
const userName = args[0] || "Student";
const port = Number(args[1]) || 3001;

console.log("\n========== 1. CLI INPUTS ==========");
console.log("All command-line inputs:", args);
console.log(`Hello, ${userName}!`);

console.log("\n========== 2. EXECUTION ORDER ==========");
log("Step 1: Program started");

// Synchronous file operations block execution until they finish.
console.log("\n========== 3. SYNCHRONOUS FILE OPERATIONS ==========");
console.log("Before synchronous write");
try {
  fs.writeFileSync(filePath, "Created by the Execution Flow Analysis tool.\n");
  console.log("Synchronous write completed.");

  const contents = fs.readFileSync(filePath, "utf8");
  console.log("Synchronous read content:", contents.trim());
} catch (error) {
  console.error("Synchronous file operation failed:", error.message);
}
console.log("After synchronous file operations");

// Asynchronous file operations let the program continue while the operation runs.
console.log("\n========== 4. ASYNCHRONOUS FILE OPERATIONS ==========");
console.log("Before asynchronous read");
fs.readFile(filePath, "utf8", (error, contents) => {
  if (error) {
    console.error("Asynchronous file read failed:", error.message);
    return;
  }
  console.log("Asynchronous read completed:", contents.trim());
});
console.log("After starting asynchronous read");

// Demonstrate event-loop ordering.
console.log("\n========== 5. EVENT LOOP ORDER ==========");
console.log("A. Synchronous statement");
Promise.resolve().then(() => console.log("B. Promise microtask"));
setTimeout(() => console.log("C. setTimeout callback"), 0);

// HTTP server for request and response analysis.
console.log("\n========== 6. HTTP SERVER ANALYSIS ==========");
const server = http.createServer((req, res) => {
  console.log("\n[HTTP] Request received");
  console.log("[HTTP] Method:", req.method);
  console.log("[HTTP] URL:", req.url);
  console.log("[HTTP] Before response");

  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Welcome to Smart Utility Toolkit!");
  } else if (req.url === "/status") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ status: "success", message: "Server is running" }));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("404 - Page Not Found");
  }

  console.log("[HTTP] Response sent with status:", res.statusCode);
});

server.listen(port, () => {
  console.log(`[HTTP] Server running at http://localhost:${port}`);
  console.log(`[HTTP] Try http://localhost:${port}/ and /status`);
});

console.log("\nMain synchronous statements finished; async callbacks may run later.");
