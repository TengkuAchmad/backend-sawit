// LIBRARIES
const express        = require("express");
const cors           = require("cors");
const bodyParser     = require("body-parser");
const compression    = require("compression");
const cookieParser   = require("cookie-parser");
const multer         = require("multer");
const morgan         = require("morgan");
const serverless  = require("serverless-http");

// APP CONFIG
const app            = express();
const upload         = multer();
const port           = process.env.PORT || 3000;
const appFirebase    = require("../app/firebase/firebase.config.js");

app.use(morgan('combined'));

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());

app.use(upload.any());

app.use(express.json());

// ROUTES
const app_routes = require("../app/routes/app.route.js");
const user_routes = require("../app/routes/user.route.js");
const model_routes = require("../app/routes/model.route.js");
const scan_routes = require("../app/routes/scan.route.js");
const result_routes = require("../app/routes/result.route");
const workspace_routes = require("../app/routes/workspace.route");
const data_routes = require("../app/routes/data.route.js");

const endpoints  = [ app_routes, user_routes, model_routes, scan_routes, result_routes, workspace_routes, data_routes ];

app.use('/.netlify/functions/api', endpoints);

module.exports.handler = serverless(app);

// app.use(endpoints);

// const server = app.listen(port, () => {
//    console.log(`App is listening on port ${port}`);
// });