const express = require('express');
require('dotenv').config();
var logger = require('morgan');

// database config
const db = require("./config/db.js");

// routes
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

db.connectDB(); 

app.use('/api', routes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
