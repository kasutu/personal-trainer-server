import fs from "fs";

const BASE_URL = "http://localhost:3000/api/auth";
const REPORT_FILE = "integration-report.txt";

// Static test values
const TEST_USER_EMAIL = "integrationuser@example.com";
const TEST_USER_USERNAME = "integrationuser";
const TEST_USER_PASSWORD = "integrationpass";
const TEST_ROLE_NAME = "INTEGRATION_ROLE";
const TEST_ROLE_DESC = "Integration test role";

const ids = {};

function logToFile(message) {
  fs.appendFileSync(REPORT_FILE, message + "\n");
}

function generateCoverageReport(results) {
  const report = [];
  report.push("\n" + "=".repeat(80));
  report.push("AUTH ENDPOINTS INTEGRATION REPORT");
  report.push("=".repeat(80));
  let success = 0,
    fail = 0;
  for (const r of results) {
    report.push(`\n${r.description}: ${r.status ? "✅" : "❌"}`);
    if (r.status) success++;
    else fail++;
    report.push(`  Method: ${r.method}  URL: ${r.url}`);
    if (r.expect !== undefined) {
      report.push(`  Expected: ${r.expect}  Got: ${r.code}`);
    }
    if (r.error) report.push(`  Error: ${r.error}`);
  }
  report.push("\nSUMMARY:");
  report.push(`  Total: ${results.length}`);
  report.push(`  Success: ${success}`);
  report.push(`  Failed: ${fail}`);
  report.push("=".repeat(80));
  return report.join("\n");
}

async function preTestCleanup() {
  // Delete test user, role, and user-role if they exist
  try {
    // Find user by email
    let res = await fetch(`${BASE_URL}/user/by-email/${TEST_USER_EMAIL}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data?.id) {
        await fetch(`${BASE_URL}/user/${data.data.id}`, { method: "DELETE" });
      }
    }
  } catch {}
  try {
    // Find role by name
    let res = await fetch(`${BASE_URL}/role/by-name/${TEST_ROLE_NAME}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data?.id) {
        await fetch(`${BASE_URL}/role/${data.data.id}`, { method: "DELETE" });
      }
    }
  } catch {}
}

async function runIntegrationTests() {
  await preTestCleanup();
  fs.writeFileSync(
    REPORT_FILE,
    `Integration Test Report - ${new Date().toISOString()}\nTest Environment: ${BASE_URL}\n\n`
  );

  const results = [];

  // 1. Create Role
  let res = await fetch(`${BASE_URL}/role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: TEST_ROLE_NAME, description: TEST_ROLE_DESC }),
  });
  let body = await res.text();
  let roleId;
  try {
    roleId = JSON.parse(body).data?.id;
  } catch {}
  ids.roleId = roleId;
  results.push({
    description: "Create role",
    method: "POST",
    url: `${BASE_URL}/role`,
    status: res.status === 201,
    code: res.status,
    expect: 201,
    error: res.status !== 201 ? body : undefined,
  });

  // 2. Get Role by ID
  res = await fetch(`${BASE_URL}/role/${roleId}`);
  body = await res.text();
  results.push({
    description: "Get role by ID",
    method: "GET",
    url: `${BASE_URL}/role/${roleId}`,
    status: res.status === 200,
    code: res.status,
    expect: 200,
    error: res.status !== 200 ? body : undefined,
  });

  // 3. Create User (send password, not hashedPassword)
  res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: TEST_USER_EMAIL,
      username: TEST_USER_USERNAME,
      password: TEST_USER_PASSWORD,
      lastLoginAt: new Date().toISOString(),
    }),
  });
  body = await res.text();
  let userId;
  try {
    userId = JSON.parse(body).data?.id;
  } catch {}
  ids.userId = userId;
  results.push({
    description: "Create user",
    method: "POST",
    url: `${BASE_URL}/user`,
    status: res.status === 201,
    code: res.status,
    expect: 201,
    error: res.status !== 201 ? body : undefined,
  });

  // 4. Get User by ID
  res = await fetch(`${BASE_URL}/user/${userId}`);
  body = await res.text();
  results.push({
    description: "Get user by ID",
    method: "GET",
    url: `${BASE_URL}/user/${userId}`,
    status: res.status === 200,
    code: res.status,
    expect: 200,
    error: res.status !== 200 ? body : undefined,
  });

  // 5. Assign Role to User
  res = await fetch(`${BASE_URL}/user-role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, roleId }),
  });
  body = await res.text();
  let userRoleId;
  try {
    userRoleId = JSON.parse(body).data?.id;
  } catch {}
  ids.userRoleId = userRoleId;
  results.push({
    description: "Assign role to user",
    method: "POST",
    url: `${BASE_URL}/user-role`,
    status: res.status === 201,
    code: res.status,
    expect: 201,
    error: res.status !== 201 ? body : undefined,
  });

  // 6. Get User Roles
  res = await fetch(`${BASE_URL}/user/${userId}/roles`);
  body = await res.text();
  results.push({
    description: "Get user roles",
    method: "GET",
    url: `${BASE_URL}/user/${userId}/roles`,
    status: res.status === 200,
    code: res.status,
    expect: 200,
    error: res.status !== 200 ? body : undefined,
  });

  // 7. Remove User Role
  res = await fetch(`${BASE_URL}/user-role/${userRoleId}`, {
    method: "DELETE",
  });
  body = await res.text();
  results.push({
    description: "Remove user role",
    method: "DELETE",
    url: `${BASE_URL}/user-role/${userRoleId}`,
    status: res.status === 200,
    code: res.status,
    expect: 200,
    error: res.status !== 200 ? body : undefined,
  });

  // 8. Delete User
  res = await fetch(`${BASE_URL}/user/${userId}`, { method: "DELETE" });
  body = await res.text();
  results.push({
    description: "Delete user",
    method: "DELETE",
    url: `${BASE_URL}/user/${userId}`,
    status: res.status === 200,
    code: res.status,
    expect: 200,
    error: res.status !== 200 ? body : undefined,
  });

  // 9. Delete Role
  res = await fetch(`${BASE_URL}/role/${roleId}`, { method: "DELETE" });
  body = await res.text();
  results.push({
    description: "Delete role",
    method: "DELETE",
    url: `${BASE_URL}/role/${roleId}`,
    status: res.status === 200,
    code: res.status,
    expect: 200,
    error: res.status !== 200 ? body : undefined,
  });

  // Generate and log coverage report
  const coverageReport = generateCoverageReport(results);
  logToFile(coverageReport);
  console.log(coverageReport);
  console.log(
    `\n📊 Integration test complete. Full report saved to: ${REPORT_FILE}`
  );
}

runIntegrationTests();
