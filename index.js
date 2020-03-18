/*IMPORTS*/
const express = require("express");
const path = require("path");
const app = express();

/*SETUP VARIABLES*/
const port = process.env.PORT || 8282;

/*WORKINGS*/

app.listen(port, () => {
    console.log("Runnin On :: " + port);
});


app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

app.use('/api', require('./server/api'))
