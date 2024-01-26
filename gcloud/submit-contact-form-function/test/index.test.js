const assert = require("assert");
const { request } = require("gaxios");
const { exec } = require("child_process");
const waitPort = require("wait-port");

const startFF = async (target, signature, port) => {
  const ff = exec(
    `npx functions-framework --target=${target} --signature-type=${signature} --port=${port}`
  );
  await waitPort({ host: "localhost", port });
  return ff;
};

const httpInvocation = (fnUrl, port) => {
  const baseUrl = `http://localhost:${port}`;

  // GET request
  return request({
    url: `${baseUrl}/${fnUrl}`,
  });
};

describe("index.test.js", () => {
  const functionName = "submit-contact-form";
  describe(`GET ${functionName}`, () => {
    const PORT = 8081;
    let ffProc;

    before(async () => {
      ffProc = await startFF(`${functionName}`, "http", PORT);
    });

    after(() => ffProc.kill());

    it(`${functionName}: should print hello world`, async () => {
      const response = await httpInvocation(`${functionName}`, PORT);
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data, "Hello World!");
    });
  });
});
