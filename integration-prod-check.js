import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000/api/v1/credentials";
const REPORT_FILE = path.join(process.cwd(), "integration-report.txt");

const endpoints = [
  // Member
  { method: "GET", url: "/member/1" },
  { method: "GET", url: "/member/by-member/1" },
  { method: "GET", url: "/member/by-email/test@example.com" },
  {
    method: "POST",
    url: "/member",
    body: { email: "integration@example.com", password: "testpass" },
    expectHashed: true,
  },
  {
    method: "PUT",
    url: "/member/1",
    body: { email: "integration@example.com", password: "testpass" },
    expectHashed: true,
  },
  { method: "DELETE", url: "/member/1" },
  // Instructor
  { method: "GET", url: "/instructor/1" },
  { method: "GET", url: "/instructor/by-instructor/1" },
  { method: "GET", url: "/instructor/by-username/testuser" },
  {
    method: "POST",
    url: "/instructor",
    body: { username: "testuser", password: "testpass" },
    expectHashed: true,
  },
  {
    method: "PUT",
    url: "/instructor/1",
    body: { username: "testuser", password: "testpass" },
    expectHashed: true,
  },
  { method: "DELETE", url: "/instructor/1" },
  // Admin
  { method: "GET", url: "/admin/1" },
  { method: "GET", url: "/admin/by-admin/1" },
  { method: "GET", url: "/admin/by-username/testadmin" },
  {
    method: "POST",
    url: "/admin",
    body: { username: "testadmin", password: "testpass" },
    expectHashed: true,
  },
  {
    method: "PUT",
    url: "/admin/1",
    body: { username: "testadmin", password: "testpass" },
    expectHashed: true,
  },
  { method: "DELETE", url: "/admin/1" },
  // Utility
  { method: "GET", url: "/member/email-available?email=test@example.com" },
  { method: "GET", url: "/instructor/username-available?username=testuser" },
  { method: "GET", url: "/admin/username-available?username=testadmin" },
  { method: "GET", url: "/username-available?username=testuser" },
  { method: "GET", url: "/find-by-username?username=testuser" },
  { method: "GET", url: "/stats" },
  { method: "GET", url: "/recent-logins" },
];

function logToFile(message) {
  fs.appendFileSync(REPORT_FILE, message + "\n");
}

function prettyJson(str) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

async function runIntegrationTests() {
  let success = 0,
    fail = 0;
  fs.writeFileSync(
    REPORT_FILE,
    `Integration Test Report - ${new Date().toISOString()}\n\n`
  );
  for (const endpoint of endpoints) {
    const fullUrl = BASE_URL + endpoint.url;
    const timestamp = new Date().toISOString();
    let log = `\n[${timestamp}] [${endpoint.method}] ${fullUrl}`;
    let response, responseBody, error;
    try {
      log += `\nRequest Headers: {\n  Content-Type: application/json\n}`;
      if (endpoint.body) {
        log += `\nRequest Body: ${JSON.stringify(endpoint.body, null, 2)}`;
      }
      response = await fetch(fullUrl, {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined,
      });
      responseBody = await response.text();
      log += `\nStatus: ${response.status}`;
      log += `\nResponse Headers: ${JSON.stringify(
        Object.fromEntries(response.headers.entries()),
        null,
        2
      )}`;
      log += `\nResponse Body:\n${prettyJson(responseBody)}`;
      if (response.ok) {
        log += "\nResult: SUCCESS";
        success++;
      } else {
        log += "\nResult: FAIL";
        fail++;
      }
    } catch (err) {
      error = err;
      log += `\nERROR: ${err.message}\n${err.stack}`;
      log += "\nResult: ERROR";
      fail++;
    }
    logToFile(log + "\n" + "=".repeat(80));
  }
  const summary = `\nIntegration test run complete.\nSuccess: ${success}\nFail/Error: ${fail}\nTotal: ${endpoints.length}\n`;
  logToFile(summary);
  console.log(`Integration test complete. See ${REPORT_FILE}`);
}

runIntegrationTests();
