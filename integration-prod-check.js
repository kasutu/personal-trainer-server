import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000/api/v1/credentials";
const REPORT_FILE = path.join(process.cwd(), "integration-report.txt");

// Test user IDs and unique values
const TEST_MEMBER_ID = 1000;
const TEST_INSTRUCTOR_ID = 1001;
const TEST_ADMIN_ID = 1002;
const TEST_MEMBER_EMAIL = `integration${TEST_MEMBER_ID}@example.com`;
const TEST_INSTRUCTOR_EMAIL = `instructor${TEST_INSTRUCTOR_ID}@example.com`;
const TEST_ADMIN_EMAIL = `admin${TEST_ADMIN_ID}@example.com`;
const TEST_INSTRUCTOR_USERNAME = `testuser${TEST_INSTRUCTOR_ID}`;
const TEST_ADMIN_USERNAME = `testadmin${TEST_ADMIN_ID}`;

const unique = Date.now();
const ids = {};

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

// Helper to create a user (member, instructor, admin) before credentials
async function createUser(type) {
  let url, body;
  if (type === "member") {
    url = "http://localhost:3000/api/v1/members";
    body = {
      id: TEST_MEMBER_ID,
      firstName: "Test",
      lastName: "User",
      gender: "Other",
      dateOfBirth: "1990-01-01",
      phone: "1234567890",
      dateOfApplication: "2020-01-01",
      appliedMembership: "BASIC",
      monthOfApplication: "January",
      email: TEST_MEMBER_EMAIL,
    };
  } else if (type === "instructor") {
    url = "http://localhost:3000/api/v1/instructors";
    body = {
      id: TEST_INSTRUCTOR_ID,
      firstName: "Test",
      lastName: "Instructor",
      gender: "Other",
      dateOfBirth: "1990-01-01",
      email: TEST_INSTRUCTOR_EMAIL,
      number: "1234567890",
    };
  } else if (type === "admin") {
    url = "http://localhost:3000/api/v1/admins";
    body = {
      id: TEST_ADMIN_ID,
      firstName: "Test",
      lastName: "Admin",
      email: TEST_ADMIN_EMAIL,
    };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.data?.id || body.id; // fallback to intended id if not returned
}

// Helper to get the next available ID for a table
async function getNextId(table) {
  let url, idField;
  if (table === "member") {
    url = "http://localhost:3000/api/v1/members";
    idField = "id";
  } else if (table === "instructor") {
    url = "http://localhost:3000/api/v1/instructors";
    idField = "id";
  } else if (table === "admin") {
    url = "http://localhost:3000/api/v1/admins";
    idField = "id";
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return 1000; // fallback
    const data = await res.json();
    const ids = (data.data || []).map((item) => item[idField]);
    const maxId = Math.max(0, ...ids);
    return maxId + 1;
  } catch {
    return 1000;
  }
}

// Pre-test cleanup: delete any test credentials and users with static values
async function preTestCleanup() {
  // Helper to delete by credential type and identifier
  async function deleteCredential(type, identifier) {
    let lookupUrl, id;
    if (type === "member") {
      lookupUrl = `${BASE_URL}/find-by-email?email=${TEST_MEMBER_EMAIL}`;
    } else {
      lookupUrl = `${BASE_URL}/find-by-username?username=${identifier}`;
    }
    try {
      const res = await fetch(lookupUrl);
      if (!res.ok) return;
      const data = await res.json();
      id = data.data?.id;
      if (!id) return;
      // Delete credential by ID
      await fetch(`${BASE_URL}/${type}/${id}`, { method: "DELETE" });
    } catch {}
  }
  // Delete member credential
  await deleteCredential("member", TEST_MEMBER_EMAIL);
  // Delete instructor credential
  await deleteCredential("instructor", TEST_INSTRUCTOR_USERNAME);
  // Delete admin credential
  await deleteCredential("admin", TEST_ADMIN_USERNAME);
}

async function runIntegrationTests() {
  // Dynamically get next available IDs
  const nextMemberId = await getNextId("member");
  const nextInstructorId = await getNextId("instructor");
  const nextAdminId = await getNextId("admin");

  // Generate unique test values
  const TEST_MEMBER_EMAIL = `integration${nextMemberId}@example.com`;
  const TEST_INSTRUCTOR_EMAIL = `instructor${nextInstructorId}@example.com`;
  const TEST_ADMIN_EMAIL = `admin${nextAdminId}@example.com`;
  const TEST_INSTRUCTOR_USERNAME = `testuser${nextInstructorId}`;
  const TEST_ADMIN_USERNAME = `testadmin${nextAdminId}`;

  // Pre-test cleanup: delete any test credentials and users with static values
  await preTestCleanup(
    TEST_MEMBER_EMAIL,
    TEST_INSTRUCTOR_USERNAME,
    TEST_ADMIN_USERNAME
  );

  let success = 0,
    fail = 0;
  fs.writeFileSync(
    REPORT_FILE,
    `Integration Test Report - ${new Date().toISOString()}\n\n`
  );

  // Helper to create a user (member, instructor, admin) before credentials
  async function createUser(type, id, email, username) {
    let url, body;
    if (type === "member") {
      url = "http://localhost:3000/api/v1/members";
      body = {
        id,
        firstName: "Test",
        lastName: "User",
        gender: "Other",
        dateOfBirth: "1990-01-01",
        phone: "1234567890",
        dateOfApplication: "2020-01-01",
        appliedMembership: "BASIC",
        monthOfApplication: "January",
        email,
      };
    } else if (type === "instructor") {
      url = "http://localhost:3000/api/v1/instructors";
      body = {
        id,
        firstName: "Test",
        lastName: "Instructor",
        gender: "Other",
        dateOfBirth: "1990-01-01",
        email,
        number: "1234567890",
      };
    } else if (type === "admin") {
      url = "http://localhost:3000/api/v1/admins";
      body = {
        id,
        firstName: "Test",
        lastName: "Admin",
        email,
      };
    }
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data.data?.id || id; // fallback to intended id if not returned
  }

  // Create users before credentials
  const memberId = await createUser("member", nextMemberId, TEST_MEMBER_EMAIL);
  await createUser(
    "instructor",
    nextInstructorId,
    TEST_INSTRUCTOR_EMAIL,
    TEST_INSTRUCTOR_USERNAME
  );
  await createUser(
    "admin",
    nextAdminId,
    TEST_ADMIN_EMAIL,
    TEST_ADMIN_USERNAME
  );

  // Fetch the actual instructor and admin IDs from the DB (use first match)
  async function getUserIdByEmailOrUsername(type, email, username) {
    let url;
    if (type === "instructor") {
      url = "http://localhost:3000/api/v1/instructors";
    } else if (type === "admin") {
      url = "http://localhost:3000/api/v1/admins";
    }
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    if (!data.data) return undefined;
    if (type === "instructor") {
      return (data.data.find((i) => i.email === email || i.username === username) || {}).id;
    } else if (type === "admin") {
      return (data.data.find((a) => a.email === email || a.username === username) || {}).id;
    }
    return undefined;
  }
  const instructorId = await getUserIdByEmailOrUsername(
    "instructor",
    TEST_INSTRUCTOR_EMAIL,
    TEST_INSTRUCTOR_USERNAME
  );
  const adminId = await getUserIdByEmailOrUsername(
    "admin",
    TEST_ADMIN_EMAIL,
    TEST_ADMIN_USERNAME
  );

  // Define endpoints after user creation so IDs are correct
  const endpoints = [
    // Member
    {
      method: "POST",
      url: "/member",
      body: { email: TEST_MEMBER_EMAIL, password: "testpass" },
      expect: 201,
      storeIdAs: "memberCredentialId",
    },
    {
      method: "GET",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
    },
    {
      method: "PUT",
      url: () => `/member/${ids.memberCredentialId}`,
      body: { email: TEST_MEMBER_EMAIL, password: "testpass2" },
      expect: 200,
    },
    {
      method: "GET",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
    },
    {
      method: "DELETE",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
    },
    {
      method: "GET",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
    },
    // Instructor
    {
      method: "POST",
      url: "/instructor",
      body: {
        username: TEST_INSTRUCTOR_USERNAME,
        password: "testpass",
        instructorId: instructorId,
      },
      expect: 201,
      storeIdAs: "instructorCredentialId",
    },
    {
      method: "GET",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
    },
    {
      method: "PUT",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      body: { username: TEST_INSTRUCTOR_USERNAME, password: "testpass2" },
      expect: 200,
    },
    {
      method: "GET",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
    },
    {
      method: "DELETE",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
    },
    {
      method: "GET",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
    },
    // Admin
    {
      method: "POST",
      url: "/admin",
      body: { username: TEST_ADMIN_USERNAME, password: "testpass", adminId: adminId },
      expect: 201,
      storeIdAs: "adminCredentialId",
    },
    {
      method: "GET",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
    },
    {
      method: "PUT",
      url: () => `/admin/${ids.adminCredentialId}`,
      body: { username: TEST_ADMIN_USERNAME, password: "testpass2" },
      expect: 200,
    },
    {
      method: "GET",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
    },
    {
      method: "DELETE",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
    },
    {
      method: "GET",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
    },
    // Utility
    {
      method: "GET",
      url: `/member/email-available?email=${TEST_MEMBER_EMAIL}`,
    },
    {
      method: "GET",
      url: `/instructor/username-available?username=${TEST_INSTRUCTOR_USERNAME}`,
    },
    {
      method: "GET",
      url: `/admin/username-available?username=${TEST_ADMIN_USERNAME}`,
    },
    {
      method: "GET",
      url: `/username-available?username=${TEST_INSTRUCTOR_USERNAME}`,
    },
    {
      method: "GET",
      url: `/find-by-username?username=${TEST_INSTRUCTOR_USERNAME}`,
    },
    { method: "GET", url: "/stats" },
    { method: "GET", url: "/recent-logins" },
  ];

  for (const endpoint of endpoints) {
    const path =
      typeof endpoint.url === "function" ? endpoint.url() : endpoint.url;
    const url = BASE_URL + path;
    const timestamp = new Date().toISOString();
    let log = `\n[${timestamp}] [${endpoint.method}] ${url}`;
    let response, responseBody, error;
    // If the path contains 'undefined', skip this endpoint (dependent on previous success)
    if (path.includes("undefined")) {
      log += "\nSKIPPED: Dependent ID was not set due to previous failure.";
      logToFile(log + "\n" + "=".repeat(80));
      console.log(log + "\n" + "=".repeat(80));
      fail++;
      continue;
    }
    try {
      log += `\nRequest Headers: {\n  Content-Type: application/json\n}`;
      if (endpoint.body) {
        log += `\nRequest Body: ${JSON.stringify(endpoint.body, null, 2)}`;
      }
      response = await fetch(url, {
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
    // Only access response if it exists
    if (response && endpoint.storeIdAs && response.ok) {
      const parsed = JSON.parse(responseBody);
      ids[endpoint.storeIdAs] = parsed.data?.id;
    }
    if (response && endpoint.expect !== undefined) {
      if (response.status === endpoint.expect) {
        log += `\nExpectation: ${endpoint.expect} (PASS)`;
      } else {
        log += `\nExpectation: ${endpoint.expect} (FAIL)`;
      }
    }
    logToFile(log + "\n" + "=".repeat(80));
    console.log(log + "\n" + "=".repeat(80));
  }
  const summary = `\nIntegration test run complete.\nSuccess: ${success}\nFail/Error: ${fail}\nTotal: ${endpoints.length}\n`;
  logToFile(summary);
  console.log(`Integration test complete. See ${REPORT_FILE}`);
}

runIntegrationTests();
