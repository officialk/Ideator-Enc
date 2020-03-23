/*IMPORTS*/
const express = require("express");
const path = require("path");
const app = express();

/*SETUP VARIABLES*/
const port = 8282;

/*WORKINGS*/
/*Starting the server*/
app.listen(port, () => {
    console.clear()
    console.log("Runnin On :: " + port);
});

//defining the www or static folder for server to server files from
app.use(express.static(path.join(__dirname, 'public')))

//setting up the server to accept json data
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
//telling the server to route the api calls to this file
app.use('/api', require('./server/api'))
