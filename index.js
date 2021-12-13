const express=require('express')
const morgan = require("morgan");
const swaggerUI = require('swagger-ui-express');
const swaggerYaml = require('yamljs');
const postRoutes = require("./routes/post");

const app = express();
const swaggerDoc  = swaggerYaml.load('./swagger.yaml');

app.use(morgan("dev"));
app.use("/",postRoutes);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDoc));
app.get('/', (req,res) => {
    res.send("hey")
});

app.listen(8080);