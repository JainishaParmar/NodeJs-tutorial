const express=require('express')
const app=express();
const morgan=require("morgan");
const postRoutes=require("./routes/post");
const date = require('date-and-time')
const swaggerUI=require('swagger-ui-express');
    

const swaggerYaml = require('yamljs');
const swaggerDoc   = swaggerYaml.load('./swagger.yaml');


app.use(morgan("dev"));
app.use("/",postRoutes);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDoc));
app.get('/', (req,res) => {
    res.send("hey")
});

app.listen(8080);



