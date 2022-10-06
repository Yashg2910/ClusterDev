const express = require('express');
const mongodb = require('./src/db/mongodb');
const devicesCtrl = require("./src/controllers/devicesCtrl");
const packageStatsCtrl = require("./src/controllers/statsCtrl");

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
const PORT = 3000;

mongodb.init();

app.post("/v2/submit", devicesCtrl.create);

app.get("/devices", devicesCtrl.get);

app.get("/stats/package_name", packageStatsCtrl.get);
  
app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to ClusterDev Server");
});
  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);