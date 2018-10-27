'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const morgan = require('morgan');
const path = require('path');
const app = express();

/**
 * Configuration
 */

 app.set('port', (process.env.PORT || 9000));

 /**
  * Setting up the express application
  */

 app.use(morgan('dev')); // logs every request to the console.
 app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit: 100000 })) // parse application/x-www-form-urlencoded
 app.use(bodyParser.json({limit: '50mb'})); // parse application/json
 app.set('trust proxy', 1)
 app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
 app.use(express.static(__dirname + '/uploads'));

 /**
  * Starting the application
  */
 app.listen(app.get('port'), function() {
    const url = 'http://localhost:' + app.set('port');
    console.log('Application running on port: ', chalk.green(app.get('port')));
    console.log('click to open in a browser: ' + url );  
});

/**
 * Routes
 */
app.get('/', function(req, res) {
    res.status(200).send('Hello World');
})

require('./routes/user')(app);
require('./routes/movies')(app);