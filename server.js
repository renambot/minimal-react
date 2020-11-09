
// Nodejs modules
const fs    = require('fs');
const tls   = require('tls');
const path  = require('path');
const http  = require('http');

// Imported modules from npm
const express     = require('express');
const compression = require('compression');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const morgan      = require('morgan');
const qs          = require('querystring');
const cookieParser = require('cookie-parser');

// Exception
process.on('unhandledRejection', (reason, p) =>
	console.error('Unhandled Rejection at: Promise ', p, reason)
);


// Create the main express object
const app = express();
// adding Helmet to enhance your API's security
// app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// enabling CORS for all requests
app.use(cors());
// Compress
app.use(compression());
// Cookies
app.use(cookieParser());
// Send tiny format to stdout
app.use(morgan('tiny'));

// API Router
var router = express.Router();
// Setup the route handlers
// -> /api/home
router.route('/home').get((req, res, next) => getHome(res, next));
// API routes
// all of our routes will be prefixed with /api
app.use('/api', router);

// Create the HTTP server
//   0.0.0.0 forces to listen on IPv4
var httpServer = http.createServer(app);
httpServer.listen(8888, "0.0.0.0", function() {
	console.log('HTTP listening on port %d', httpServer.address().port);
});

// Finally serve static content
app.use(express.static("./dist/"));



/**
 * Handler for the /home route
 * 
 * @param {any} res 
 * @param {any} next 
 */
function getHome(res, next) {
        let result = {msg: "Home"};
        res.json(result);
}

