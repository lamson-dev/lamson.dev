const functions = require("@google-cloud/functions-framework");

// Register an HTTP function with the Functions Framework
functions.http("submit-contact-form", async (req, res) => {
  // Set CORS headers for preflight requests
  res.set("Access-Control-Allow-Origin", "*");

  switch (req.method) {
    case "OPTIONS":
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "GET, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type, X-Api-Key");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      return;
    case "GET":
      res.status(200).send("Hello World!");
      return;
    case "POST":
      // handling POST request below
      // res.status(200).send(req.body);
      break;
    default:
      res.status(403).send("Forbidden!");
      return;
  }

  if (req.body.botField) {
    res.status(403).send("Forbidden!");
    return;
  }

  const {
    name: nameQ,
    email: emailQ,
    organization: organizationQ,
    note: noteQ,
  } = req.query;
  const {
    name: nameB,
    email: emailB,
    organization: organizationB,
    note: noteB,
  } = req.body;

  const name = nameQ || nameB;
  const email = emailQ || emailB;
  const organization = organizationQ || organizationB;
  const note = noteQ || noteB;

  if (!name || !email || !organization || !note) {
    res.status(400).send("Missing required parameters");
    return;
  }

  const params = {
    name,
    email,
    organization,
    note,
  };

  const useWorkflow = false;
  const apiFunc = useWorkflow ? callWorkflowsAPI : callSheetsAPI;
  const result = await apiFunc(params);

  if (!result.success) {
    return res.status(500).send(`Failed to submit contact form.`);
  }

  // Success!
  res.status(200).send(`Successfully submitted contact form`);
});

async function callSheetsAPI(params) {
  const { name, email, organization, note } = params;
  const valuesToAppend = [name, email, organization, note];

  const spreadsheetId = "1NakupblmiGT5DaCz3B5uOocsifuOtEXGLwlOHhRC-CA";
  const range = "Sheet1!A1";
  const valueInputOption = "RAW";

  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  const resource = {
    majorDimension: "ROWS",
    values: [valuesToAppend],
  };
  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log(`${result.data.updates.updatedCells} cells appended.`);
    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err,
    };
  }
}

const { ExecutionsClient } = require("@google-cloud/workflows");
const client = new ExecutionsClient();

/**
 * Calls the Workflow API and waits for the execution result.
 */
async function callWorkflowsAPI({ name, email, organization, note }) {
  const projectId = "active-smile-408717";
  const location = "us-central1";
  const workflowName = "write-entry-to-contacts-sheet";

  // Execute workflow
  try {
    const [execution] = await client.createExecution({
      parent: client.workflowPath(projectId, location, workflowName),
      execution: {
        argument: JSON.stringify({
          name,
          email,
          organization,
          note,
        }),
      },
    });

    const executionName = execution.name;
    console.log(`Created execution: ${executionName}`);

    // Wait for execution to finish, then print results.
    let executionFinished = false;
    let backoffDelay = 1000; // Start wait with delay of 1,000 ms
    console.log("Poll every second for result...");
    while (!executionFinished) {
      const [execution] = await client.getExecution({
        name: executionName,
      });
      executionFinished = execution.state !== "ACTIVE";

      // If we haven't seen the result yet, wait a second.
      if (!executionFinished) {
        console.log("- Waiting for results...");
        await new Promise(resolve => {
          setTimeout(resolve, backoffDelay);
        });
        backoffDelay *= 2; // Double the delay to provide exponential backoff.
      } else {
        console.log(`Execution finished with state: ${execution.state}`);
        console.log(execution.result);
        return {
          success: true,
          data: execution.result,
        };
      }
    }
  } catch (e) {
    console.error(`Error executing workflow: ${e}`);
    return {
      success: false,
      error: e,
    };
  }
}
