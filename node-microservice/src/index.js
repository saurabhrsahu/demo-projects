const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "node-microservice";

app.get("/", (req, res) => {
  res.json({
    service: serviceName,
    message: "Hello from the Node microservice v2",
  });
});

app.get("/healthz", (req, res) => {
  res.json({ status: "ok", service: serviceName });
});

app.get("/readyz", (req, res) => {
  res.json({ status: "ready", service: serviceName });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`${serviceName} listening on port ${port}`);
});

