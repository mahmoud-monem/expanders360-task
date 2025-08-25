const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";
let authToken = "";
let adminToken = "";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step) {
  log(colors.blue + colors.bold, `\n📍 ${step}`);
}

function logSuccess(message) {
  log(colors.green, `✅ ${message}`);
}

function logError(message) {
  log(colors.red, `❌ ${message}`);
}

function logWarning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
      config.headers["Content-Type"] = "application/json";
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 0,
    };
  }
}

async function testAuth() {
  logStep("Authentication Tests");

  // Test client login
  const clientLogin = await makeRequest("POST", "/auth/login", {
    email: "john.smith@techcorp.com",
    password: "password123",
  });

  if (clientLogin.success) {
    authToken = clientLogin.data.token || clientLogin.data.accessToken;
    logSuccess("Client login successful");
  } else {
    logError("Client login failed: " + JSON.stringify(clientLogin.error));
    return false;
  }

  // Test admin login
  const adminLogin = await makeRequest("POST", "/auth/login", {
    email: "admin@expanders360.com",
    password: "password123",
  });

  if (adminLogin.success) {
    adminToken = adminLogin.data.token || adminLogin.data.accessToken;
    logSuccess("Admin login successful");
  } else {
    logError("Admin login failed: " + JSON.stringify(adminLogin.error));
    return false;
  }

  // Test profile fetch
  const profile = await makeRequest("GET", "/auth/profile", null, authToken);
  if (profile.success) {
    logSuccess("Profile fetch successful");
  } else {
    logError("Profile fetch failed: " + JSON.stringify(profile.error));
  }

  return true;
}

async function testProjects() {
  logStep("Project Module Tests");

  // Get projects list
  const projectsList = await makeRequest("GET", "/projects", null, authToken);
  if (projectsList.success) {
    logSuccess(`Projects list retrieved: ${projectsList.data.items?.length || 0} projects`);
  } else {
    logError("Projects list failed: " + JSON.stringify(projectsList.error));
  }

  // Get project details
  if (projectsList.success && projectsList.data.items?.length > 0) {
    const projectId = projectsList.data.items[0].id;
    const projectDetails = await makeRequest("GET", `/projects/${projectId}`, null, authToken);
    if (projectDetails.success) {
      logSuccess("Project details retrieved");
    } else {
      logError("Project details failed: " + JSON.stringify(projectDetails.error));
    }

    // Test project matches rebuild
    const matchRebuild = await makeRequest("POST", `/projects/${projectId}/matches/rebuild`, null, authToken);
    if (matchRebuild.success) {
      logSuccess(`Matches rebuilt: ${matchRebuild.data.totalMatches} matches created`);
    } else {
      logError("Match rebuild failed: " + JSON.stringify(matchRebuild.error));
    }
  }

  // Create new project
  const newProject = await makeRequest(
    "POST",
    "/projects",
    {
      countryId: 1,
      neededServices: ["market_research", "legal_services"],
      budget: 50000,
    },
    authToken,
  );

  if (newProject.success) {
    logSuccess("New project created");

    // Test matches for new project
    const newProjectMatches = await makeRequest("POST", `/projects/${newProject.data.id}/matches/rebuild`, null, authToken);
    if (newProjectMatches.success) {
      logSuccess(`New project matches: ${newProjectMatches.data.totalMatches} matches`);
    } else {
      logError("New project matches failed: " + JSON.stringify(newProjectMatches.error));
    }
  } else {
    logError("New project creation failed: " + JSON.stringify(newProject.error));
  }
}

async function testVendors() {
  logStep("Vendor Module Tests");

  // Get vendors list
  const vendorsList = await makeRequest("GET", "/vendors", null, authToken);
  if (vendorsList.success) {
    logSuccess(`Vendors list retrieved: ${vendorsList.data.items?.length || 0} vendors`);
  } else {
    logError("Vendors list failed: " + JSON.stringify(vendorsList.error));
  }

  // Get vendor details
  if (vendorsList.success && vendorsList.data.items?.length > 0) {
    const vendorId = vendorsList.data.items[0].id;
    const vendorDetails = await makeRequest("GET", `/vendors/${vendorId}`, null, authToken);
    if (vendorDetails.success) {
      logSuccess("Vendor details retrieved");
    } else {
      logError("Vendor details failed: " + JSON.stringify(vendorDetails.error));
    }
  }

  // Test vendor filters
  const filteredVendors = await makeRequest(
    "GET",
    "/vendors?filters[supportedCountryId]=1&filters[offeredServices]=market_research",
    null,
    authToken,
  );
  if (filteredVendors.success) {
    logSuccess(`Filtered vendors: ${filteredVendors.data.items?.length || 0} results`);
  } else {
    logError("Vendor filtering failed: " + JSON.stringify(filteredVendors.error));
  }
}

async function testAnalytics() {
  logStep("Analytics Module Tests");

  // Test top vendors analytics
  const topVendors = await makeRequest("GET", "/analytics/top-vendors", null, adminToken);
  if (topVendors.success) {
    logSuccess(`Top vendors analytics: ${topVendors.data?.length || 0} countries analyzed`);

    if (topVendors.data?.length > 0) {
      topVendors.data.forEach(countryData => {
        console.log(
          `  🌍 ${countryData.country}: ${countryData.topVendors.length} top vendors, ${countryData.researchDocumentCount} research docs`,
        );
      });
    }
  } else {
    logError("Top vendors analytics failed: " + JSON.stringify(topVendors.error));
  }

  // Test vendor performance metrics
  const vendorPerformance = await makeRequest("GET", "/analytics/vendor-performance/1?days=30", null, adminToken);
  if (vendorPerformance.success) {
    logSuccess("Vendor performance metrics retrieved");
  } else {
    logError("Vendor performance failed: " + JSON.stringify(vendorPerformance.error));
  }
}

async function testMatches() {
  logStep("Match Module Tests");

  // Get matches list
  const matchesList = await makeRequest("GET", "/matches", null, authToken);
  if (matchesList.success) {
    logSuccess(`Matches list retrieved: ${matchesList.data?.length || 0} matches`);
  } else {
    logError("Matches list failed: " + JSON.stringify(matchesList.error));
  }

  // Get match details
  if (matchesList.success && matchesList.data?.length > 0) {
    const matchId = matchesList.data[0].id;
    const matchDetails = await makeRequest("GET", `/matches/${matchId}`, null, authToken);
    if (matchDetails.success) {
      logSuccess("Match details retrieved");
    } else {
      logError("Match details failed: " + JSON.stringify(matchDetails.error));
    }
  }
}

async function testCountries() {
  logStep("Country Module Tests");

  // Get countries list
  const countriesList = await makeRequest("GET", "/countries", null, authToken);
  if (countriesList.success) {
    logSuccess(`Countries list retrieved: ${countriesList.data.items?.length || 0} countries`);
  } else {
    logError("Countries list failed: " + JSON.stringify(countriesList.error));
  }

  // Get country details
  if (countriesList.success && countriesList.data.items?.length > 0) {
    const countryId = countriesList.data.items[0].id;
    const countryDetails = await makeRequest("GET", `/countries/${countryId}`, null, authToken);
    if (countryDetails.success) {
      logSuccess("Country details retrieved");
    } else {
      logError("Country details failed: " + JSON.stringify(countryDetails.error));
    }
  }
}

async function testUsers() {
  logStep("User Module Tests");

  // Get users list (admin only)
  const usersList = await makeRequest("GET", "/users", null, adminToken);
  if (usersList.success) {
    logSuccess(`Users list retrieved: ${usersList.data.items?.length || 0} users`);
  } else {
    logError("Users list failed: " + JSON.stringify(usersList.error));
  }
}

async function testResearchDocuments() {
  logStep("Research Document Module Tests");

  // Get research documents list
  const docsList = await makeRequest("GET", "/research-documents", null, authToken);
  if (docsList.success) {
    logSuccess(`Research documents retrieved: ${docsList.data.items?.length || 0} documents`);
  } else {
    logError("Research documents failed: " + JSON.stringify(docsList.error));
  }

  // Test creating a research document
  const newDoc = await makeRequest(
    "POST",
    "/research-documents",
    {
      title: "Test Market Analysis",
      description: "Test document for market analysis",
      projectId: 1,
      tags: ["test", "market-analysis"],
      content: "This is test content for the research document",
    },
    authToken,
  );

  if (newDoc.success) {
    logSuccess("Research document created");
  } else {
    logError("Research document creation failed: " + JSON.stringify(newDoc.error));
  }
}

async function testHealth() {
  logStep("Health Check Tests");

  // Test health endpoint
  const health = await makeRequest("GET", "/health");
  if (health.success) {
    logSuccess("Health check passed");
  } else {
    logError("Health check failed: " + JSON.stringify(health.error));
  }
}

async function runAllTests() {
  log(colors.bold + colors.blue, "🚀 Starting Comprehensive API Tests\n");

  try {
    // Wait for server to be ready
    log(colors.yellow, "⏳ Waiting for server to be ready...");
    await sleep(3000);

    // Test authentication first
    const authSuccess = await testAuth();
    if (!authSuccess) {
      logError("Authentication failed. Cannot proceed with other tests.");
      return;
    }

    // Run all test suites
    await testHealth();
    await testCountries();
    await testUsers();
    await testVendors();
    await testProjects();
    await testMatches();
    await testAnalytics();
    await testResearchDocuments();

    log(colors.bold + colors.green, "\n🎉 All tests completed!");
  } catch (error) {
    logError("Test suite failed: " + error.message);
  }
}

// Check if server is running and start tests
async function checkServerAndRun() {
  try {
    // Try multiple health endpoints
    let healthCheck = await makeRequest("GET", "/health");
    if (!healthCheck.success) {
      healthCheck = await makeRequest("GET", "/");
    }
    if (!healthCheck.success) {
      // Try auth endpoint to verify server is responsive
      healthCheck = await makeRequest("POST", "/auth/login", {});
    }

    if (healthCheck.success || healthCheck.status === 400 || healthCheck.status === 401) {
      logSuccess("Server is running, starting tests...");
      await runAllTests();
    } else {
      logError("Server is not responding. Please make sure the application is running on " + BASE_URL);
    }
  } catch (error) {
    logError("Cannot connect to server. Please make sure the application is running on " + BASE_URL);
  }
}

// Run the tests
checkServerAndRun();
