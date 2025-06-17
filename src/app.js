const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const routes = require("./routes");

const {
  notFoundHandler,
  errorHandler,
  errorConverter,
} = require("./middlewares/errorHandler");

const bodyParser = require("body-parser");
const { performance } = require("perf_hooks"); // Import performance module for timing

require("dotenv").config();
const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Making public folder static for publicly access
app.use(express.static("public"));

// For handling form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(
  cors({
    origin: true, // allow server to accept request from different origin
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Configuring i18next
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-node-fs-backend");
const serverHomePage = require("./helpers/serverHomePage");

let translationPath = __dirname + "/translation/{{lng}}/translation.json";

if (process.env.NODE_ENV === "production") {
  translationPath = path.resolve(
    __dirname,
    "dist",
    "translation/{{lng}}/translation.json"
  );
}

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: translationPath,
    },
    detection: {
      order: ["header"],
      caches: ["cookie"],
    },
    preload: ["en", "de"],
    fallbackLng: process.env.API_RESPONCE_LANGUAGE,
  });
app.use(i18nextMiddleware.handle(i18next));

let responseTimes = [];
// Middleware to calculate and store API response times
const responseTimeLogger = (req, res, next) => {
  const startTime = performance.now();

  res.on("finish", () => {
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    let label = "Low";
    if (elapsedTime >= 1000) {
      label = "High";
    } else if (elapsedTime >= 500) {
      label = "Medium";
    }
    const routeInfo = {
      route: req.originalUrl,
      time: elapsedTime.toFixed(2),
      label,
    };
    responseTimes.push(routeInfo);
  });

  next();
};

// Initialize API routes
app.use("/api/v1", responseTimeLogger, routes);

// Testing API is alive
app.get("/", (req, res) => {
  res.send(serverHomePage(req, responseTimes));
});

// Invalid route handler
app.use(notFoundHandler);

// Error converter
app.use(errorConverter);

// Error handling
app.use(errorHandler);

module.exports = {app, responseTimes};
