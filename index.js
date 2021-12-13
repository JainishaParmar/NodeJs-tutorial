const express = require('express');

const swaggerUI = require('swagger-ui-express');
const swaggerYaml = require('yamljs');

const app = express();
const swaggerDoc = swaggerYaml.load('./swagger.yaml');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.listen(8080);
