'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();

// MIDDLEWARE
app.use(express.json());

app.get('*', (req, res, next) => {
  console.debug(`Endpoint accessed: ${JSON.stringify({ url: req.baseUrl + req.path, httpMethod: req.method })}` );
  res.status(200).json({
    description: "First Docker app deployed to GCP",
    name: "first-docker-gcp",
    version: "1.0.0"
  });
})

app.listen(PORT, () => {
  logger.info(`Example app listening at http://localhost:${PORT}`)
})
