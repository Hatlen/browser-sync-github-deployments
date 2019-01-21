const debugLog = require("debug")("log");
const debugError = require("debug")("error");
const dotenvFlow = require("dotenv-flow");
const fs = require("fs");
const octokit = require("@octokit/rest")();
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const bs = require("browser-sync").create();
const fetch = require("node-fetch");

if (process.env.NODE_ENV !== "production") {
  dotenvFlow.config();
}

const options = {
  GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
};

octokit.authenticate({
  type: "token",
  token: options.GITHUB_PERSONAL_ACCESS_TOKEN
});

const express = require("express");
const app = express();

app.use(bodyParser.json());

app.get("/deployments", (req, res) => {
  Promise.all(
    process.env.GITHUB_REPOSITORIES.split(",").map(githubRepo =>
      octokit.request(`GET /repos/${githubRepo}/deployments`)
    )
  )
    .then(deployments => {
      const response = deployments
        .map(repoDeployments =>
          repoDeployments.data.map(
            ({ payload: { web_url: url }, updated_at: updatedAt }) => ({
              url,
              updatedAt
            })
          )
        )
        .flat()
        .sort((a, b) => a.updatedAt > b.updatedAt)
        .reduce((unique, deployment) => {
          if (
            !unique.find(
              uniqueDeployment => uniqueDeployment.url === deployment.url
            )
          ) {
            unique.push(deployment);
          }
          return unique;
        }, []);
      res.send(response);
    })
    .catch(debugError);
});

app.post("/browser-sync", async (req, res) => {
  bs.exit();
  const response = await fetch(req.body.url.replace("https", "http"));
  bs.init(
    {
      proxy: response.url,
      port: 3002,
      ui: {
        port: 3001
      }
    },
    () => res.json({ active: req.body.url })
  );
});

app.use(express.static("dist"));

const port = process.env.PORT || 3000;
app.listen(port, () =>
  debugLog(`Browser-sync github deployments running on port ${port}!`)
);
