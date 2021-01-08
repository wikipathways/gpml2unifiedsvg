const WebhooksApi = require("@octokit/webhooks");
const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const GH_WEBHOOK_SECRET = process.env.npm_config_GH_WEBHOOK_SECRET;

const port = process.env.PORT || 5000;
const app = express();

const webhooks = new WebhooksApi({
  secret: GH_WEBHOOK_SECRET
});

const LINUX_BREW_BIN = "/data/project/wikipathways2wiki/.linuxbrew/bin";
const GPMLCONVERTER = `PATH=${LINUX_BREW_BIN}:$PATH; /data/project/wikipathways2wiki/GPMLConverter/bin/gpmlconverter`;

webhooks.on("push", ({ id, name, payload }) => {
  // currently have hooks at:
  // https://github.com/ariutta/gpml-samples
  // https://github.com/egonw/SARS-CoV-2-WikiPathways

  const repoFullName = payload.repository.full_name;
  const baseUrl = "https://raw.githubusercontent.com/" + repoFullName;
  const now = (new Date).toISOString();

  // added and modified
  payload.commits
    .reduce(function(acc, commit) {
      const commitId = commit.id;
      const baseCommitUrl = [baseUrl, commitId].join("/");

      console.log(`${now}\tcommit detected\t${repoFullName}\t${commitId}`);

      (commit.added || []).map(file => ({"eventType": "added", file}))
        .concat(
          (commit.modified || []).map(file => ({"eventType": "modified", file}))
        )
        .filter(({eventType, file}) => file.endsWith(".gpml"))
        .forEach(function({eventType, file}) {
          const url = [baseCommitUrl, file].join("/");
          const wpid = file.replace("gpml/", "").replace(".gpml", "");
          acc.push({ eventType, url, wpid });
        });
      return acc;
    }, [])
    .forEach(function({ eventType, url, wpid }) {
      console.log(`${now}\t${eventType}\t${url}`);

      https
        .get(url, function(res) {
          const blobPath = `${__dirname}/public/${wpid}.*`;
          const tmpGpmlPath = `${__dirname}/public/tmp${wpid}.gpml`;
          const gpmlPath = `${__dirname}/public/${wpid}.gpml`;
          const svgPath = `${__dirname}/public/${wpid}.svg`;
          const tmpGpmlFileStream = fs.createWriteStream(tmpGpmlPath);
          res.on("end", function() {
            //const cmd = `PATH="/data/project/wikipathways2wiki/www/js:/data/project/wikipathways2wiki/.npm-global/bin:$PATH"; ${GPMLCONVERTER} --id ${wpid} ${gpmlPath} ${svgPath} > ${svgPath}.log 2>&1;`;
            const cmd = `PATH="/data/project/wikipathways2wiki/www/js:/data/project/wikipathways2wiki/.npm-global/bin:$PATH"; touch ${gpmlPath} && rm ${blobPath} && mv ${tmpGpmlPath} ${gpmlPath} && ${GPMLCONVERTER} --id ${wpid} ${gpmlPath} ${svgPath} > ${svgPath}.log 2>&1;`;
            console.log(cmd);
            exec(cmd);
            console.log("Finished");
          });
          res.pipe(tmpGpmlFileStream);
        })
        .on("error", function(e) {
          console.error(e);
        });
    });

});

app.use(
  "/wikipathways2wiki/public",
  express.static(path.join(__dirname, "public"))
);

app.use(
  "/",
  express.static(path.join(__dirname, "data"))
);

app.use("/wikipathways2wiki/pubsubhubbub", webhooks.middleware);

app.get("/wikipathways2wiki/", (req, res) => {
  console.log("Received request at /");
  return res.send("Hello World! Received request at /");
});
app.get("/wikipathways2wiki/page.html", (req, res) => {
  console.log("Received request at /page.html");
  return res.send("Hello World! Received request at /page.html");
});

//app.get('/page.html', (req, res) => res.send('Hello World!'))
//app.get('/wikipathways2wiki/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
