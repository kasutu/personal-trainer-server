import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000/api/v1/credentials";
const REPORT_FILE = path.join(process.cwd(), "integration-report.txt");

// Use static test values
const TEST_MEMBER_ID = 1000;
const TEST_INSTRUCTOR_ID = 1001;
const TEST_ADMIN_ID = 1002;
const TEST_MEMBER_EMAIL = `integration${TEST_MEMBER_ID}@example.com`;
const TEST_INSTRUCTOR_EMAIL = `instructor${TEST_INSTRUCTOR_ID}@example.com`;
const TEST_ADMIN_EMAIL = `admin${TEST_ADMIN_ID}@example.com`;
const TEST_INSTRUCTOR_USERNAME = `testuser${TEST_INSTRUCTOR_ID}`;
const TEST_ADMIN_USERNAME = `testadmin${TEST_ADMIN_ID}`;
const ids = {};

// Coverage tracking
const coverage = {
  member: { total: 0, success: 0, fail: 0, skip: 0 },
  instructor: { total: 0, success: 0, fail: 0, skip: 0 },
  admin: { total: 0, success: 0, fail: 0, skip: 0 },
  utility: { total: 0, success: 0, fail: 0, skip: 0 },
  overall: { total: 0, success: 0, fail: 0, skip: 0 },
};

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

function updateCoverage(category, result) {
  coverage[category].total++;
  coverage.overall.total++;

  switch (result) {
    case "success":
      coverage[category].success++;
      coverage.overall.success++;
      break;
    case "fail":
      coverage[category].fail++;
      coverage.overall.fail++;
      break;
    case "skip":
      coverage[category].skip++;
      coverage.overall.skip++;
      break;
  }
}

function generateCoverageReport() {
  const report = [];
  report.push("\n" + "=".repeat(80));
  report.push("COVERAGE REPORT");
  report.push("=".repeat(80));

  // Calculate percentages for each category
  const categories = ["member", "instructor", "admin", "utility"];

  categories.forEach((category) => {
    const cat = coverage[category];
    if (cat.total === 0) return;

    const successRate = ((cat.success / cat.total) * 100).toFixed(1);
    const failRate = ((cat.fail / cat.total) * 100).toFixed(1);
    const skipRate = ((cat.skip / cat.total) * 100).toFixed(1);

    report.push(`\n${category.toUpperCase()} ENDPOINTS:`);
    report.push(`  Total: ${cat.total}`);
    report.push(`  Success: ${cat.success} (${successRate}%)`);
    report.push(`  Failed: ${cat.fail} (${failRate}%)`);
    report.push(`  Skipped: ${cat.skip} (${skipRate}%)`);

    // Status indicator
    let status = "🔴 CRITICAL";
    if (cat.success === cat.total) status = "🟢 EXCELLENT";
    else if (cat.success >= cat.total * 0.8) status = "🟡 GOOD";
    else if (cat.success >= cat.total * 0.5) status = "🟠 NEEDS ATTENTION";

    report.push(`  Status: ${status}`);
  });

  // Overall summary
  const overall = coverage.overall;
  const overallSuccessRate = ((overall.success / overall.total) * 100).toFixed(
    1
  );
  const overallFailRate = ((overall.fail / overall.total) * 100).toFixed(1);
  const overallSkipRate = ((overall.skip / overall.total) * 100).toFixed(1);

  report.push(`\nOVERALL SUMMARY:`);
  report.push(`  Total Endpoints: ${overall.total}`);
  report.push(`  Success: ${overall.success} (${overallSuccessRate}%)`);
  report.push(`  Failed: ${overall.fail} (${overallFailRate}%)`);
  report.push(`  Skipped: ${overall.skip} (${overallSkipRate}%)`);

  // Overall health indicator
  let overallHealth = "🔴 SYSTEM DOWN";
  if (overall.success === overall.total)
    overallHealth = "🟢 ALL SYSTEMS OPERATIONAL";
  else if (overall.success >= overall.total * 0.9)
    overallHealth = "🟡 MINOR ISSUES";
  else if (overall.success >= overall.total * 0.7)
    overallHealth = "🟠 MAJOR ISSUES";
  else if (overall.success >= overall.total * 0.5)
    overallHealth = "🔴 CRITICAL ISSUES";

  report.push(`  Health Status: ${overallHealth}`);

  // Recommendations with more specific guidance
  report.push(`\nRECOMMENDATIONS:`);
  if (overall.skip > 0) {
    report.push(
      `  • ${overall.skip} endpoints were skipped due to missing dependencies`
    );
    report.push(
      `  • Check instructor/admin creation endpoints: /api/v1/instructors and /api/v1/admins`
    );
  }
  if (overall.fail > 0) {
    report.push(
      `  • ${overall.fail} endpoints failed and need immediate attention`
    );
    if (coverage.utility.fail > 0) {
      report.push(
        `  • CRITICAL: Apply the service patch to fix availability check methods`
      );
    }
  }
  if (overall.success === overall.total) {
    report.push(`  • All endpoints are working correctly! 🎉`);
  } else {
    const criticalCategories = categories.filter(
      (cat) =>
        coverage[cat].total > 0 &&
        coverage[cat].success < coverage[cat].total * 0.8
    );
    if (criticalCategories.length > 0) {
      report.push(
        `  • Priority fix: ${criticalCategories.join(", ")} endpoints`
      );
    }
  }

  report.push("=".repeat(80));

  return report.join("\n");
}

// Enhanced diagnostic function
async function diagnoseDependencies() {
  const diagnostics = [];
  diagnostics.push("\nDIAGNOSTIC REPORT");
  diagnostics.push("=".repeat(50));

  // Test if instructor/admin endpoints exist
  const endpoints = [
    {
      name: "Instructors API",
      url: "http://localhost:3000/api/v1/instructors",
    },
    { name: "Admins API", url: "http://localhost:3000/api/v1/admins" },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, { method: "GET" });
      if (response.status === 404) {
        diagnostics.push(`❌ ${endpoint.name}: Endpoint not found (404)`);
      } else if (response.status >= 500) {
        diagnostics.push(
          `🔴 ${endpoint.name}: Server error (${response.status})`
        );
      } else {
        diagnostics.push(`✅ ${endpoint.name}: Available (${response.status})`);
      }
    } catch (error) {
      diagnostics.push(
        `🔴 ${endpoint.name}: Connection failed - ${error.message}`
      );
    }
  }

  // Test basic credential endpoints
  try {
    const response = await fetch(`${BASE_URL}/stats`);
    if (response.ok) {
      diagnostics.push(`✅ Credentials API: Working`);
    } else {
      diagnostics.push(`🔴 Credentials API: Error ${response.status}`);
    }
  } catch (error) {
    diagnostics.push(`🔴 Credentials API: Connection failed`);
  }

  diagnostics.push("=".repeat(50));
  return diagnostics.join("\n");
}

// Pre-test cleanup: delete any test credentials and users with static values
async function preTestCleanup() {
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
      await fetch(`${BASE_URL}/${type}/${id}`, { method: "DELETE" });
    } catch {}
  }
  await deleteCredential("member", TEST_MEMBER_EMAIL);
  await deleteCredential("instructor", TEST_INSTRUCTOR_USERNAME);
  await deleteCredential("admin", TEST_ADMIN_USERNAME);
}

async function runIntegrationTests() {
  await preTestCleanup();

  fs.writeFileSync(
    REPORT_FILE,
    `Integration Test Report - ${new Date().toISOString()}\n` +
      `Test Environment: ${BASE_URL}\n` +
      `Test Data: Member ID ${TEST_MEMBER_ID}, Instructor ID ${TEST_INSTRUCTOR_ID}, Admin ID ${TEST_ADMIN_ID}\n\n`
  );

  // Run diagnostics first
  const diagnosticsReport = await diagnoseDependencies();
  logToFile(diagnosticsReport);
  console.log(diagnosticsReport);

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

    try {
      console.log(`Attempting to create ${type} at ${url}...`);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const responseText = await res.text();
      console.log(
        `${type} creation response: ${res.status} - ${responseText.slice(
          0,
          200
        )}`
      );

      if (!res.ok) {
        logToFile(
          `❌ Failed to create ${type}: ${res.status} - ${responseText}`
        );
        return null;
      }

      const data = JSON.parse(responseText);
      return data.data?.id || id;
    } catch (error) {
      console.error(`Error creating ${type}:`, error.message);
      logToFile(`❌ Error creating ${type}: ${error.message}`);
      return null;
    }
  }

  // Helper to verify user creation
  async function verifyUser(type, id) {
    if (!id) return false;

    let url;
    if (type === "instructor") {
      url = `http://localhost:3000/api/v1/instructors/${id}`;
    } else if (type === "admin") {
      url = `http://localhost:3000/api/v1/admins/${id}`;
    } else if (type === "member") {
      url = `http://localhost:3000/api/v1/members/${id}`;
    }

    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.id === id) return true;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    return false;
  }

  // Create users before credentials
  console.log("Creating test users...");
  const memberId = await createUser(
    "member",
    TEST_MEMBER_ID,
    TEST_MEMBER_EMAIL
  );
  const instructorId = await createUser(
    "instructor",
    TEST_INSTRUCTOR_ID,
    TEST_INSTRUCTOR_EMAIL,
    TEST_INSTRUCTOR_USERNAME
  );
  const adminId = await createUser(
    "admin",
    TEST_ADMIN_ID,
    TEST_ADMIN_EMAIL,
    TEST_ADMIN_USERNAME
  );

  // Verify instructor and admin creation
  const instructorExists =
    instructorId && (await verifyUser("instructor", instructorId));
  const adminExists = adminId && (await verifyUser("admin", adminId));

  if (!instructorExists) {
    console.error(
      "❌ Failed to verify instructor creation. Skipping instructor credential tests."
    );
    logToFile(
      "WARNING: Instructor creation failed - instructor tests will be skipped"
    );
  } else {
    console.log("✅ Instructor created successfully");
  }

  if (!adminExists) {
    console.error(
      "❌ Failed to verify admin creation. Skipping admin credential tests."
    );
    logToFile("WARNING: Admin creation failed - admin tests will be skipped");
  } else {
    console.log("✅ Admin created successfully");
  }

  // Define endpoints with categories
  const endpoints = [
    // Member CRUD Operations
    {
      method: "POST",
      url: "/member",
      body: { email: TEST_MEMBER_EMAIL, password: "testpass" },
      expect: 201,
      storeIdAs: "memberCredentialId",
      category: "member",
      description: "Create member credentials",
    },
    {
      method: "GET",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
      category: "member",
      description: "Get member credentials by ID",
    },
    {
      method: "PUT",
      url: () => `/member/${ids.memberCredentialId}`,
      body: { email: TEST_MEMBER_EMAIL, password: "testpass2" },
      expect: 200,
      category: "member",
      description: "Update member credentials",
    },
    {
      method: "GET",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
      category: "member",
      description: "Verify member credentials update",
    },
    {
      method: "DELETE",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
      category: "member",
      description: "Delete member credentials",
    },
    {
      method: "GET",
      url: () => `/member/${ids.memberCredentialId}`,
      expect: 200,
      category: "member",
      description: "Verify member credentials deletion",
    },

    // Instructor CRUD Operations
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
      skip: !instructorExists,
      category: "instructor",
      description: "Create instructor credentials",
    },
    {
      method: "GET",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
      category: "instructor",
      description: "Get instructor credentials by ID",
    },
    {
      method: "PUT",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      body: { username: TEST_INSTRUCTOR_USERNAME, password: "testpass2" },
      expect: 200,
      category: "instructor",
      description: "Update instructor credentials",
    },
    {
      method: "GET",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
      category: "instructor",
      description: "Verify instructor credentials update",
    },
    {
      method: "DELETE",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
      category: "instructor",
      description: "Delete instructor credentials",
    },
    {
      method: "GET",
      url: () => `/instructor/${ids.instructorCredentialId}`,
      expect: 200,
      category: "instructor",
      description: "Verify instructor credentials deletion",
    },

    // Admin CRUD Operations
    {
      method: "POST",
      url: "/admin",
      body: {
        username: TEST_ADMIN_USERNAME,
        password: "testpass",
        adminId: adminId,
      },
      expect: 201,
      storeIdAs: "adminCredentialId",
      skip: !adminExists,
      category: "admin",
      description: "Create admin credentials",
    },
    {
      method: "GET",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
      category: "admin",
      description: "Get admin credentials by ID",
    },
    {
      method: "PUT",
      url: () => `/admin/${ids.adminCredentialId}`,
      body: { username: TEST_ADMIN_USERNAME, password: "testpass2" },
      expect: 200,
      category: "admin",
      description: "Update admin credentials",
    },
    {
      method: "GET",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
      category: "admin",
      description: "Verify admin credentials update",
    },
    {
      method: "DELETE",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
      category: "admin",
      description: "Delete admin credentials",
    },
    {
      method: "GET",
      url: () => `/admin/${ids.adminCredentialId}`,
      expect: 200,
      category: "admin",
      description: "Verify admin credentials deletion",
    },

    // Utility Endpoints
    {
      method: "GET",
      url: `/member/email-available?email=${TEST_MEMBER_EMAIL}`,
      category: "utility",
      description: "Check member email availability",
    },
    {
      method: "GET",
      url: `/instructor/username-available?username=${TEST_INSTRUCTOR_USERNAME}`,
      category: "utility",
      description: "Check instructor username availability",
    },
    {
      method: "GET",
      url: `/admin/username-available?username=${TEST_ADMIN_USERNAME}`,
      category: "utility",
      description: "Check admin username availability",
    },
    {
      method: "GET",
      url: `/username-available?username=${TEST_INSTRUCTOR_USERNAME}`,
      category: "utility",
      description: "Check global username availability",
    },
    {
      method: "GET",
      url: `/find-by-username?username=${TEST_INSTRUCTOR_USERNAME}`,
      category: "utility",
      description: "Find credentials by username",
    },
    {
      method: "GET",
      url: "/stats",
      category: "utility",
      description: "Get credentials statistics",
    },
    {
      method: "GET",
      url: "/recent-logins",
      category: "utility",
      description: "Get recent login activity",
    },
  ];

  console.log("\nRunning endpoint tests...");
  for (const endpoint of endpoints) {
    if (endpoint.skip) {
      const log = `\n[SKIPPED] ${endpoint.method} ${endpoint.url} - ${endpoint.description}`;
      logToFile(log + "\nReason: Dependency not created\n" + "=".repeat(80));
      console.log(`${endpoint.description}: ⏭️ SKIPPED`);
      updateCoverage(endpoint.category, "skip");
      continue;
    }

    const path =
      typeof endpoint.url === "function" ? endpoint.url() : endpoint.url;
    const url = BASE_URL + path;
    const timestamp = new Date().toISOString();
    let log = `\n[${timestamp}] [${endpoint.method}] ${url}`;
    log += `\nDescription: ${endpoint.description}`;
    log += `\nCategory: ${endpoint.category.toUpperCase()}`;

    let response, responseBody, error;

    if (path.includes("undefined")) {
      log += "\nSKIPPED: Dependent ID was not set due to previous failure.";
      logToFile(log + "\n" + "=".repeat(80));
      console.log(`${endpoint.description}: ⏭️ SKIPPED`);
      updateCoverage(endpoint.category, "skip");
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
        log += "\nResult: SUCCESS ✅";
        updateCoverage(endpoint.category, "success");
        console.log(`${endpoint.description}: ✅`);
      } else {
        log += "\nResult: FAIL ❌";
        updateCoverage(endpoint.category, "fail");
        console.log(`${endpoint.description}: ❌ (${response.status})`);
      }
    } catch (err) {
      error = err;
      log += `\nERROR: ${err.message}\n${err.stack}`;
      log += "\nResult: ERROR ❌";
      updateCoverage(endpoint.category, "fail");
      console.log(`${endpoint.description}: ❌ ERROR`);
    }

    if (response && endpoint.storeIdAs && response.ok) {
      const parsed = JSON.parse(responseBody);
      ids[endpoint.storeIdAs] = parsed.data?.id;
    }

    if (response && endpoint.expect !== undefined) {
      if (response.status === endpoint.expect) {
        log += `\nExpectation: ${endpoint.expect} (PASS ✅)`;
      } else {
        log += `\nExpectation: ${endpoint.expect} (FAIL ❌)`;
      }
    }

    logToFile(log + "\n" + "=".repeat(80));
  }

  // Generate and log coverage report
  const coverageReport = generateCoverageReport();
  logToFile(coverageReport);
  console.log(coverageReport);

  console.log(
    `\n📊 Integration test complete. Full report saved to: ${REPORT_FILE}`
  );
}

runIntegrationTests();
